import { OrderItem } from 'src/orders/order-item.entity';
import { Store } from 'src/store/store.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column('text', { array: true })
  category: string[];

  @Column()
  price: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItem: OrderItem;

  @ManyToOne(() => Store, (store) => store.products)
  store: Store;
}
