import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Department } from '../../department/entities/department.entity';
import { Order } from 'src/order/entities/order.entity';
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
  points: number

  @ManyToMany(() => Department, (department) => department.users)
  departments: Department[];

  @OneToMany(()=>Order,(order)=>order.user)
  orders:Order[]
}
