import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { OrderService } from './order.service';
import { OrderItemController } from './order.controller';
import { Product } from 'src/products/product.entity';
import { Cart } from 'src/cart/cart.entity';
import { User } from 'src/users/user.entity';
import { Order } from './order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Product, Cart, User, Order])],
  controllers: [OrderItemController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderItemModule {}
