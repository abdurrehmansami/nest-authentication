import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../category/entities/category.entity';
import { Deal } from 'src/deal/entities/deal.entity';
import { Public } from 'src/public.decorator';

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
    const queryRunner =
      this.productsRepository.manager.connection.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const product = queryRunner.manager.create(Product, createProductDto);
      const category = await queryRunner.manager.findOne(Category, {
        where: { id: createProductDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category doesnot exist');
      }
      console.log(category);

      // category.products.push(product);
      // await queryRunner.manager.save(Category, category);
      product.category = category;

      const savedProduct = await queryRunner.manager.save(Product, product);
      await queryRunner.commitTransaction();
      return savedProduct;
    } catch (err) {
      console.log(err);

      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productsRepository.find({
      relations: ['category', 'deals'],
      select: {
        id: true,
        name: true,
        isActive: true,
        price: true,
        description: true,
        deals: {
          id: true,
          name: true,
        },
      },
    });
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const queryRunner =
      this.productsRepository.manager.connection.createQueryRunner();
    try {
      await queryRunner.manager.update(Product, id, updateProductDto);
      const updatedProduct = queryRunner.manager.findOneBy(Product, { id });
      return updatedProduct;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  async remove(id: number): Promise<Product> {
    const queryRunner =
      this.productsRepository.manager.connection.createQueryRunner();
    try {
      const product = await queryRunner.manager.findOneBy(Product, { id });
      if (!product) throw new NotFoundException('Product not found');

      product.isActive = false;
      const inActiveProduct = await queryRunner.manager.save(product);
      return inActiveProduct;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  async getProductByCategory(categoryId: number): Promise<Product[]> {
    const productsInCategory = await this.productsRepository.find({
      relations: ['category'],
      where: {
        category: {
          id: categoryId,
        },
      },
    });

    if (productsInCategory.length === 0) {
      throw new NotFoundException('No products found for this category.');
    }

    return productsInCategory;
  }
}
