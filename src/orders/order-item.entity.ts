import { Cart } from 'src/cart/cart.entity';
import { Product } from 'src/products/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { join } from 'path';

@Entity('OrderItem')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;

  @Column()
  quantity: number;

  @Column()
  totalAmount: number;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => Cart, (cart) => cart.orderItems, { nullable: true })
  @JoinColumn()
  cart: Cart | null;
}
