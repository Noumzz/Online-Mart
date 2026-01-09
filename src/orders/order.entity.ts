import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Column()
  totalAmount: number;
}
