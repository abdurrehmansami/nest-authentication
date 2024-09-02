import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { Deal } from 'src/deal/entities/deal.entity';
import { Category } from '../category/entities/category.entity';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Deal, Category])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
