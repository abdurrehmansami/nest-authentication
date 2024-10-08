import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { type } from './type.enum';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class PointHistory {
  @PrimaryGeneratedColumn()
  pointId: number;
  @ManyToOne(() => User, (user) => user.points)
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column()
  points: number;
  @Column()
  type: type;
  @CreateDateColumn()
  createdAt: Date;
}
