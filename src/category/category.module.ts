import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from 'src/product/entities/product.entity';

import { Deal } from 'src/deal/entities/deal.entity';
import { Category } from '../category/entities/category.entity';
import { ProductController } from 'src/product/product.controller';
import { ProductService } from 'src/product/product.service';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Deal, Category])],
  providers: [ProductService, CategoryService],
  controllers: [ProductController, CategoryController],
})
export class CategoryModule {}
