import { Cart } from 'src/cart/cart.entity';
import { Product } from 'src/products/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cartItem')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;

  @Column()
  quantity: number;

  @Column()
  priceAtAddTime: number;

  @Column()
  totalAmount: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  cart: Cart | null;
}
