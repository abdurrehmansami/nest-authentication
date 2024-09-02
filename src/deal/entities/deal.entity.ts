import { Product } from 'src/product/entities/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';


@Entity()
export class Deal {
  @PrimaryGeneratedColumn()
  dealId: number;

  @Column()
  discount: number;

  @ManyToMany(() => Product,(product)=>product.deals)
 @JoinTable({
    name: 'deal_products', // The name of the join table
    joinColumn: { name: 'deal_id', referencedColumnName: 'dealId' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
products:Product[]
  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}

