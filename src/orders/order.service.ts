import { InjectRepository } from '@nestjs/typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { OrderItem } from './order-item.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/product.entity';
import { NotFoundException } from '@nestjs/common';
import { Cart } from 'src/cart/cart.entity';

export class OrderService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
  ) {}

  async addToCart(addToCart: AddToCartDto) {
    const orderItem = new OrderItem();
    const cart = await this.cartRepo.findOneById(addToCart.cart);

    if (!cart) {
      throw new NotFoundException();
    }
    orderItem.cart = cart;

    const product = await this.productRepo.findOneById(addToCart.productId);
    if (!product) {
      throw new NotFoundException();
    }
    orderItem.product = product;
    orderItem.quantity = addToCart.quantity;
    orderItem.totalAmount = orderItem.quantity * orderItem.product.price;
  }
}
