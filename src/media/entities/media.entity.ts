import { Product } from 'src/product/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

export enum Flag {
  ACTIVE = 'active',
  DELETED = 'deleted',
}

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column()
  title: string;

  @Column()
  path: string;

  @Column({ nullable: true })
  mimetype: string;

  @CreateDateColumn()
  created_on: Date;

  @Column({
    type: 'enum',
    enum: Flag,
    default: Flag.ACTIVE,
  })
  flag: Flag;

  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  product: Product;
}
