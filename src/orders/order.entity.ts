import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('Order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  customerId: User;

  @OneToMany(() => OrderItem, (orderitem) => orderitem.order)
  orderItems: OrderItem[];

  @Column()
  totalAmount: number;
}
