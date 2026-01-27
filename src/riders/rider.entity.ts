import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
