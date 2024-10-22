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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/role.decorator';
import { UserRole } from 'src/auth/entities/user.entity';
import { Public } from 'src/public.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  async create(@Body(ValidationPipe) createProductDto: CreateProductDto) {
    const createdProduct = await this.productService.create(createProductDto);
    return createdProduct;
  }
  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    const products = await this.productService.findAll();
    return products;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.findOne(id);
    return product;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productService.update(
      id,
      updateProductDto,
    );
    return updatedProduct;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.remove(id);
  }
  @Public()
  @Get('category/:categoryId')
  getProductByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productService.getProductByCategory(categoryId);
  }
}
