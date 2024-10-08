import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ValidateIf((o) => o.categoryId !== null)
  @IsNumber()
  categoryId: number | null;
}

export class ProductDto extends PartialType(CreateProductDto) {
  id: number;
}
