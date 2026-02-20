import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rider } from 'src/riders/rider.entity';
import { OrderStatus } from 'src/types/enums/order-status.enum';
import { OrderItem } from './order-item.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  customerId: User;

  @Column({ default: null })
  userId: number;

  @OneToMany(() => OrderItem, (orderitem) => orderitem.order, { cascade: true })
  orderItems: OrderItem[];

  @Column()
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  orderStatus: OrderStatus;

  @ManyToOne(() => Rider, (rider) => rider.orders, { nullable: true })
  @JoinColumn()
  rider: Rider | null;

  @Column({ nullable: true })
  riderId: number;
}
