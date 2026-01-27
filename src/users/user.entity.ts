import { Exclude } from 'class-transformer';
import { Cart } from 'src/cart/cart.entity';
import { Order } from 'src/orders/order.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ type: 'text', nullable: true })
  hashedRefreshToken: string | null;

  @OneToOne(() => Cart)
  cart: Cart;

  @OneToMany(() => Order, (order) => order.customerId)
  orders: Order[];
}
