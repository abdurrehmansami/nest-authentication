import { Injectable,ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@Injectable()
export class CategoryService {
    constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category>{
    // Fetch products by IDs
    const products = await this.productsRepository.findBy({ id: In(createCategoryDto.productIds) });
    if (products.length === 0) {
      throw new NotFoundException('No products found with the provided IDs');
    }
    // Create the category
    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      products: products,  // Associate products with the category
    });
    return this.categoriesRepository.save(category);
  }

  async update(id: number, updateCategoryDto:UpdateCategoryDto){

     // Find the existing category by its ID
     const existingCategory = await this.categoriesRepository.findOne({
      where: { categoryId: id },
      relations: ['products'],  // Load related products
    });
  
    if (!existingCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  
    // Conditionally update the products relationship
    if (updateCategoryDto.productIds) {
      const products = await this.productsRepository.findBy({ id: In(updateCategoryDto.productIds) });
  
      if (products.length === 0) {
        throw new NotFoundException('No products found with the provided IDs');
      }
  
      // Update the products association
      existingCategory.products = products;
    }
  
    // Update other properties using the merge method
    this.categoriesRepository.merge(existingCategory, updateCategoryDto);
  
    // Save the updated deal
    return this.categoriesRepository.save(existingCategory);

  }

  async getCategories(){
    const categories = await this.categoriesRepository.find({relations:['products']})
    return categories;
  }

  async getCategoryById(id:number){
    const categoryOfId = await this.categoriesRepository.find({where:{categoryId:id}, relations:['products']})
    return categoryOfId;
  }

  async delete(id:number){
    const categoryToDelete = await this.categoriesRepository.findBy({ categoryId: id });
    if (!categoryToDelete) {
        throw new NotFoundException('Deal not found');
    }
    await this.categoriesRepository.delete({ categoryId: id });
    return categoryToDelete;
  }
}