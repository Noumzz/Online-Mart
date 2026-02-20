import { Exclude } from 'class-transformer';
import { Order } from 'src/orders/order.entity';
import { RiderStatus } from 'src/types/enums/rider-status.enum';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rider')
export class Rider {
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
  contactNumber: string;

  @Column()
  bikeType: string;

  @Column()
  bikeRegistrationNumber: string;

  @Column()
  linsence: string;

  @Column({ type: 'text', nullable: true, default: null })
  refreshToken: string | null;

  @Column({
    type: 'enum',
    enum: RiderStatus,
    default: RiderStatus.Busy,
  })
  status: RiderStatus;

  @OneToMany(() => Order, (order) => order.rider)
  orders: Order[];
}
