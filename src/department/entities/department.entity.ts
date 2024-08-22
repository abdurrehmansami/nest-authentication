import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { IsNotEmpty,  } from 'class-validator';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({unique:true}) 
  name: string;

  @ManyToMany(() => User, (user) => user.departments)
  @JoinTable({
    name: 'user_departments', // The name of the join table
    joinColumn: { name: 'department_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];
}
