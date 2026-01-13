import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './order-item.entity';
import { OrderItemService } from './order.service';
import { OrderItemController } from './order.controller';
import { Product } from 'src/products/product.entity';
import { Cart } from 'src/cart/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Product, Cart])],
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule {}
