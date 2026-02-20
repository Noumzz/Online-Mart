import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/product.entity';
import { Order } from 'src/orders/order.entity';
import { OrderItem } from 'src/orders/order-item.entity';
import { CartItem } from 'src/orders/cart-item.entity';
import { OrderDto } from './dto/order.dto';
//import { OrderItem } from 'src/orders/order-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
  ) {}

  async getCart(cartId: number) {
    const cart = await this.cartRepo.findOne({
      where: { id: cartId },
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!cart) {
      throw new NotFoundException('Not found');
    }
    //return cart;
    // let items: {
    //   productName: string;
    //   productQuantity: number;
    //   linePrice: number;
    // }[] = [];
    // let nettotal = 0;
    // cart.cartItems.forEach((item) => {
    //   const linePrice = item.totalAmount;
    //   const productName = item.product.productName;
    //   const productQuantity = item.quantity;
    //   nettotal += linePrice;

    //   items.push({
    //     productName: productName,
    //     productQuantity: productQuantity,
    //     linePrice: linePrice,
    //   });
    // });
    return cart;
  }

  async checkOut(cartId: number, confirmPrice = false) {
    const cart = await this.cartRepo.findOne({
      where: { id: cartId },
      relations: ['cartItems', 'cartItems.product', 'user'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not Found');
    }
    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty, cannot checkout');
    }
    const cartItems = cart.cartItems;
    const unAvailbleItems: {
      productId: number;
      productName: string;
      requested: number;
      availble: number;
    }[] = [];

    const priceChangedItems: {
      productId: number;
      productName: string;
      oldPrice: number;
      latestPrice: number;
    }[] = [];

    for (const item of cartItems) {
      const productId = item.product.id;
      const itemQuantity = item.quantity;
      const productQuantity = item.product.quantity;
      const productPrice = item.priceAtAddTime;
      const product = await this.productRepo.findOne({
        where: {
          id: productId,
        },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      const productLatestPrice = product.price;

      if (itemQuantity > productQuantity) {
        unAvailbleItems.push({
          productId,
          productName: item.product.productName,
          requested: itemQuantity,
          availble: productQuantity,
        });
      }

      if (unAvailbleItems.length > 0) {
        throw new ConflictException({
          message: 'Some items are out of stock',
          items: unAvailbleItems,
        });
      }

      if (productPrice !== productLatestPrice && !confirmPrice) {
        priceChangedItems.push({
          productId,
          productName: item.product.productName,
          oldPrice: productPrice,
          latestPrice: productLatestPrice,
        });
      }

      if (confirmPrice) {
        for (const item of cart.cartItems) {
          const product = await this.productRepo.findOne({
            where: {
              id: item.product.id,
            },
          });

          if (!product) {
            throw new NotFoundException('Product not found');
          }
          item.priceAtAddTime = product.price;
          item.totalAmount = item.quantity * product.price;
          await this.cartItemRepo.save(item);
        }
      }

      if (priceChangedItems.length > 0) {
        throw new ConflictException({
          messesge: 'some prices are updated',
          changes: priceChangedItems,
        });
      }
    }

    const order = new Order();
    order.customerId = cart.user;
    order.orderItems = [];
    for (const item of cart.cartItems) {
      const orderItem = new OrderItem();
      orderItem.order = order;
      orderItem.product = item.product;
      orderItem.quantity = item.quantity;
      orderItem.totalAmount = item.totalAmount;
      order.orderItems.push(orderItem);
    }
    // console.log('OrderItems', order.orderItems);

    let nettotal = 0;

    for (const item of cart.cartItems) {
      const product = await this.productRepo.findOne({
        where: {
          id: item.product.id,
        },
      });

      if (!product) {
        throw new NotFoundException('product not found');
      }
      const latestPrice = product.price;
      const linePrice = latestPrice * item.quantity;
      nettotal += linePrice;
    }

    order.totalAmount = nettotal;

    // return order.orderItems.map((item) => ({
    //   productId: item.product,
    //   quantity: item.quantity,
    //   toralAmount: item.totalAmount,
    // }));

    const createdOrder = await this.orderRepo.save(order);
    await this.deleteCart(cart.id);

    const orderDto: OrderDto = {
      id: createdOrder.id,
      totalAmount: createdOrder.totalAmount,
      orderStatus: createdOrder.orderStatus,
      orderItems: createdOrder.orderItems.map((item) => ({
        id: item.id,
        productId: item.product.id,
        productName: item.product.productName,
        quantity: item.quantity,
        totalAmount: item.totalAmount,
      })),
    };

    for (const item of createdOrder.orderItems) {
      const product = await this.productRepo.findOne({
        where: {
          id: item.product.id,
        },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      product.quantity -= item.quantity;
      await this.productRepo.save(product);
    }

    return orderDto;

    // await this.cartItemRepo.delete({
    //   cart: cart,
    // });

    // await this.deleteCart(cart.id);
  }

  async deleteCart(cartId: number) {
    const cart = await this.cartRepo.findOne({
      where: { id: cartId },
      relations: ['cartItems'],
    });
    if (!cart) {
      throw new NotFoundException('cart not found');
    }
    for (const item of cart.cartItems) {
      await this.cartItemRepo.remove(item);
    }
    return 'Cart Deleted Sucessfully';
  }
}
