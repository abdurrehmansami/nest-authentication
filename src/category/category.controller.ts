import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  ConflictException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from 'src/role.decorator';
import { UserRole } from 'src/auth/entities/user.entity';
import { Public } from 'src/public.decorator';
import { ProductService } from 'src/product/product.service';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
  ) {}
  @Post()
  @Roles(UserRole.ADMIN)
  async createCategory(
    @Body(ValidationPipe) createCategoryDto: CreateCategoryDto,
  ) {
    if (createCategoryDto.productIds) {
      const products = await this.productService.findAll();
      products.forEach((product) => {
        if (
          createCategoryDto.productIds.includes(product.id) &&
          product.category !== null
        ) {
          throw new ConflictException(
            `Product ${product.name} already exist in another category`,
          );
        }
      });
    }
    const createdCategory =
      await this.categoryService.create(createCategoryDto);
    return createdCategory;
  }
  // async update(@Param('id',ParseIntPipe) id: number, @Body(ValidationPipe) updateDealDto: UpdateDealDto)
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async updatedCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ) {
    // find all products that are in updateCategoryDto.productIds
    // loop through the list, and check if the category id is = :category id, if true then throw conflict error
    const updatedCategory = await this.categoryService.update(
      id,
      updateCategoryDto,
    );
    return updatedCategory;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.delete(id);
  }

  @Get()
  @Public()
  async getDeals() {
    const categories = await this.categoryService.getCategories();
    return categories;
  }

  @Get(':id')
  @Public()
  async getDealById(@Param('id', ParseIntPipe) id: number) {
    const categoryOfId = this.categoryService.getCategoryById(id);
    return categoryOfId;
  }
}
