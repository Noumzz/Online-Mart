import { InjectRepository } from '@nestjs/typeorm';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Repository } from 'typeorm';
import { Product } from 'src/products/product.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cart } from 'src/cart/cart.entity';
import { User } from 'src/users/user.entity';
import { CartItem } from './cart-item.entity';
import { Order } from './order.entity';
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepo: Repository<CartItem>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Cart)
    private cartRepo: Repository<Cart>,
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  async orderStatus(orderId: number) {
    const order = await this.findOrderById(orderId);
    return order.orderStatus;
  }
  async findOrderById(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: {
        id: orderId,
      },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async addToCart(addToCart: AddToCartDto) {
    const cart = await this.cartRepo.findOneById(addToCart.cart);

    if (!cart) {
      throw new NotFoundException('cart not found');
    }
    const product = await this.productRepo.findOneById(addToCart.productId);
    if (!product) {
      throw new NotFoundException('product not found');
    }

    if (product.quantity < 1 || product.quantity < addToCart.quantity) {
      throw new ConflictException('Out of stock');
    }

    const itemExist = await this.cartItemRepo.findOne({
      where: {
        cart: { id: addToCart.cart },
        product: { id: addToCart.productId },
      },
      relations: ['product', 'cart'],
    });
    //console.log(itemExist);

    let cartItem: CartItem;

    if (itemExist) {
      itemExist.quantity = itemExist.quantity + addToCart.quantity;
      itemExist.priceAtAddTime = product.price;
      itemExist.totalAmount = itemExist.quantity * itemExist.product.price;
      cartItem = itemExist;
    } else {
      cartItem = new CartItem();
      cartItem.cart = cart;
      cartItem.product = product;
      cartItem.priceAtAddTime = product.price;
      cartItem.quantity = addToCart.quantity;
      cartItem.totalAmount = cartItem.quantity * cartItem.product.price;
    }
    const savedCartItem = await this.cartItemRepo.save(cartItem);
    return savedCartItem;
  }
  async checkOut(userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const cart = await this.cartRepo.findOne({
      where: {
        user: user,
      },
      relations: ['user', 'cartItems'],
    });
    if (!cart) {
      throw new NotFoundException('No cart found');
    }
  }
}
