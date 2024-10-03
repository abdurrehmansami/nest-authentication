import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from 'src/auth/entities/user.entity'; // Assuming you have a User entity
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import { OrderProduct } from 'src/orderProduct/entities/orderPrdouct.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(() => User, user => user.orders, { cascade: false })
  user: User;

  @Column({type: 'decimal'})
  totalPrice: number;

  @Column({ type: 'varchar', length: 50, default:"pending" })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, { cascade: true })
  orderProducts: OrderProduct[];
}
