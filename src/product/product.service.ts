import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../category/entities/category.entity';
import { Deal } from 'src/deal/entities/deal.entity';
import { log } from 'console';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Deal)
    private dealsRepository: Repository<Deal>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    return this.productsRepository.findOneBy({ id });
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productsRepository.update(id, updateProductDto);
    return this.productsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }

  async getProductByCategory(categoryId:number): Promise<Product[]> {
    const productsWithCategories = await this.productsRepository.find({relations:['category'] ,where: {
    category: Not(null),
  },});
    // const getProductByCategory = productsWithCategories.filter(product=>product.category.categoryId == categoryId)
    // if(!getProductByCategory){
    //   throw new NotFoundException("No product of this category exist")
    // }
    console.log('PWC',productsWithCategories)
    return 
  }
}
