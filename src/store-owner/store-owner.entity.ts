import { Store } from 'src/store/store.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('StoreOwner')
export class StoreOwner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  contactNumber: string;

  @ManyToMany(() => Store, (store) => store.owners)
  stores: Store[];
}
