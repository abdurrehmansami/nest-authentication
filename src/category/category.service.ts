import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly productService: ProductService,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const queryRunner =
      this.categoriesRepository.manager.connection.createQueryRunner();
    queryRunner.startTransaction();
    try {
      // Fetch products by IDs
      if (createCategoryDto.productIds.length > 0) {
        const products = await queryRunner.manager.findBy(Product, {
          id: In(createCategoryDto.productIds),
        });
        if (products.length === 0) {
          throw new NotFoundException(
            'No products found with the provided IDs',
          );
        }

        // Create the category
        const category = queryRunner.manager.create(Category, {
          ...createCategoryDto,
          products: products, // Associate products with the category
        });
        const savedProduct = await queryRunner.manager.save(category);
        await queryRunner.commitTransaction();
        return savedProduct;
        // return queryRunner.manager.save(category);
      } else {
        const category = queryRunner.manager.create(Category, {
          ...createCategoryDto,
        });
        const savedProduct = await queryRunner.manager.save(category);
        await queryRunner.commitTransaction();
        return savedProduct;
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const queryRunner =
      this.categoriesRepository.manager.connection.createQueryRunner();
    queryRunner.startTransaction();
    try {
      // Find the existing category by its ID
      const existingCategory = await queryRunner.manager.findOne(Category, {
        where: { id },
        relations: ['products'], // Load related products
      });

      if (!existingCategory) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      // Conditionally update the products relationship
      if (updateCategoryDto.productIds.length) {
        const products = await queryRunner.manager.find(Product, {
          where: { id: In(updateCategoryDto.productIds) },
          relations: ['category'],
        });

        products.forEach((product) => {
          if (product?.category !== null && product?.category?.id !== id) {
            throw new ConflictException(
              `Product ${product.name} already exist in another category`,
            );
          }
        });

        if (!products.length) {
          throw new NotFoundException(
            'No products found with the provided IDs',
          );
        }

        // Update the products association
        existingCategory.products = products;
      } else if (updateCategoryDto.productIds.length == 0) {
        existingCategory.products = [];
      }
      // Update other properties using the merge method
      queryRunner.manager.merge(Category, existingCategory, updateCategoryDto);

      // Save the updated deal
      const savedCategory = queryRunner.manager.save(existingCategory);
      (await savedCategory).products.forEach(
        (product) => delete product.category,
      );
      await queryRunner.commitTransaction();
      return savedCategory;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  async getCategories() {
    const categories = await this.categoriesRepository.find({
      relations: ['products'],
      select: {
        products: {
          isActive: true,
          name: true,
          id: true,
        },
      },
    });
    return categories;
  }

  async getCategoryById(id: number) {
    const categoryOfId = await this.categoriesRepository.find({
      where: { id: id },
      relations: ['products'],
    });
    return categoryOfId;
  }

  async delete(id: number) {
    const queryRunner =
      this.categoriesRepository.manager.connection.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const product = await this.productsRepository.findOne({
        relations: ['category'],
        where: { category: { id } },
      });
      const result = await queryRunner.manager.delete(Category, { id });
      if (result.affected == 0) {
        throw new NotFoundException('Category not found');
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      // console.log('err', err);

      await queryRunner.rollbackTransaction();
      throw err;
    }
  }
}
