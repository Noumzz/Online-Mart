import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
  ) {}
  async getCart(cartId: number) {
    const cart = await this.cartRepo.findOne({
      where: { id: cartId },
      relations: ['orderItems', 'orderItems.product'],
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
}
