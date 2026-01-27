import {
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

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
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
      relations: ['orderItems', 'orderItems.product', 'user'],
    });

    if (!cart) {
      throw new NotFoundException('Not found');
    }
    //return cart;
    let items: {
      productName: string;
      productQuantity: number;
      linePrice: number;
    }[] = [];
    let nettotal = 0;
    cart.orderItems.forEach((item) => {
      const linePrice = item.totalAmount;
      const productName = item.product.productName;
      const productQuantity = item.quantity;
      nettotal += linePrice;

      items.push({
        productName: productName,
        productQuantity: productQuantity,
        linePrice: linePrice,
      });
    });
    return { cart, items, nettotal };
  }

  async checkOut(cartId: number) {
    const cart = await this.cartRepo.findOne({
      where: { id: cartId },
      relations: ['orderItems', 'orderItems.product', 'user'],
    });
    if (!cart) {
      throw new NotFoundException('Cart not Found');
    }
    const orderItems = cart.orderItems;
    const unAvailbleItems: {
      productId: number;
      productName: string;
      requested: number;
      availble: number;
    }[] = [];
    orderItems.forEach((item) => {
      const productId = item.product.id;
      const itemQuantity = item.quantity;
      const productQuantity = item.product.quantity;
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
    });
    const order = new Order();
    order.customerId = cart.user;
    let nettotal = 0;
    cart.orderItems.forEach((item) => {
      const linePrice = item.totalAmount;
      nettotal += linePrice;
    });

    order.totalAmount = nettotal;

    order.orderItems = cart.orderItems;
    const createdOrder = await this.orderRepo.save(order);

    await this.deleteCart(cart.id);

    return createdOrder;
  }
  async deleteCart(cartId: number) {
    const cart = await this.cartRepo.findOne({
      where: { id: cartId },
      relations: ['orderItems'],
    });
    if (!cart) {
      throw new NotFoundException('cart not found');
    }
    for (const item of cart.orderItems) {
      item.cart = null;
      await this.orderItemRepo.save(item);
    }
    await this.cartRepo.delete(cart.id);
    return 'Cart Deleted Sucessfully';
  }
}
