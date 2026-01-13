import { InjectRepository } from '@nestjs/typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { OrderItem } from './order-item.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/product.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cart } from 'src/cart/cart.entity';
import { Order } from './order.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
  ) {}

  async addToCart(addToCart: AddToCartDto) {
    const cart = await this.cartRepo.findOneById(addToCart.cart);

    if (!cart) {
      throw new NotFoundException();
    }
    const product = await this.productRepo.findOneById(addToCart.productId);
    if (!product) {
      throw new NotFoundException();
    }

    if (product.quantity < 1 || product.quantity < addToCart.quantity) {
      throw new ConflictException('Out of stock');
    }

    const itemExist = await this.orderItemRepo.findOne({
      where: {
        cart: { id: addToCart.cart },
        product: { id: addToCart.productId },
      },
      relations: ['product', 'cart'],
    });
    //console.log(itemExist);

    let orderItem: OrderItem;

    if (itemExist) {
      itemExist.quantity = itemExist.quantity + addToCart.quantity;
      itemExist.totalAmount = itemExist.quantity * itemExist.product.price;
      orderItem = itemExist;
    } else {
      orderItem = new OrderItem();
      orderItem.cart = cart;
      orderItem.product = product;
      orderItem.quantity = addToCart.quantity;
      orderItem.totalAmount = orderItem.quantity * orderItem.product.price;
    }
    const savedOrderItem = await this.orderItemRepo.save(orderItem);

    product.quantity = product.quantity - addToCart.quantity;
    await this.productRepo.save(product);
  }
}
