import { StoreOwner } from 'src/store-owner/store-owner.entity';
import { Product } from 'src/products/product.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinTable,
  OneToMany,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

@Entity('store')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  contactNumber: string;

  @Column()
  storeAddress: string;

  @ManyToMany(() => StoreOwner, (storeowner) => storeowner.stores)
  @JoinTable()
  owners: StoreOwner[];

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];
}
