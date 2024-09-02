import { TypeOrmModule } from '@nestjs/typeorm';

import { Deal } from 'src/deal/entities/deal.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { DealController } from './deal.controller';
import { Module } from '@nestjs/common';
import { Category } from 'src/category/entities/category.entity';
import { DealService } from './deal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Deal, Product, Category])],
  providers: [ProductService, DealService],
  controllers: [DealController],
})
export class DealModule {}
