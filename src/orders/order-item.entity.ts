import { Cart } from 'src/cart/cart.entity';
import { Product } from 'src/products/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('OrderItem')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;

  @Column()
  totalAmount: number;

  @ManyToOne(() => Cart, (cart) => cart.orderItems)
  cart: Cart;
}
