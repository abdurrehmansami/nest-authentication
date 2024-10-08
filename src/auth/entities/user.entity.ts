import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Order } from 'src/order/entities/order.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  points: number;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER, // Default role is user
  })
  role: UserRole;
}
