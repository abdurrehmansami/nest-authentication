import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity'; // Assuming you have a User entity
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Order } from 'src/order/entities/order.entity';
import { OrderProduct } from 'src/orderProduct/entities/orderPrdouct.entity';
import { Category } from '../../category/entities/category.entity';
import { Deal } from 'src/deal/entities/deal.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Deal, (deal) => deal.products, { nullable: true })
  deals: Deal[];

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product, {
    cascade: true,
  })
  orderProducts: OrderProduct[];
}
