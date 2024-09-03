import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
    @Post()
    async createCategory(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto){
        const createdCategory = await this.categoryService.create(createCategoryDto)
        return createdCategory;
    }
    // async update(@Param('id',ParseIntPipe) id: number, @Body(ValidationPipe) updateDealDto: UpdateDealDto)
    @Patch(':id')
    async updatedCategory(@Param('id',ParseIntPipe) id: number, @Body(ValidationPipe) updateCategoryDto:UpdateCategoryDto){
        const updatedCategory = await this.categoryService.update(id, updateCategoryDto)
        return updatedCategory
    }

    @Delete(':id')
    async delete(@Param('id',ParseIntPipe) id: number){
      const deletedCategory = await this.categoryService.delete(id)
    }

    @Get()
    async getDeals(){
      const categories = await this.categoryService.getCategories()
      return categories;
    }

    @Get(':id')
    async getDealById(@Param('id',ParseIntPipe) id:number){
      const categoryOfId = this.categoryService.getCategoryById(id)
      return categoryOfId;
    }
}