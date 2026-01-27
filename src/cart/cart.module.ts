import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Product } from 'src/products/product.entity';
import { Order } from 'src/orders/order.entity';
import { User } from 'src/users/user.entity';
import { OrderItem } from 'src/orders/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product, User, Order, OrderItem])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
