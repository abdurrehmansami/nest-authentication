import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Department } from '../../department/entities/department.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Department, (department) => department.users)
  departments: Department[];
}
