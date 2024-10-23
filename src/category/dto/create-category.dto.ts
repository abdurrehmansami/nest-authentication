import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  ArrayNotEmpty,
  ArrayMinSize,
  IsArray,
  IsOptional,
  ValidateIf,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  // @ValidateIf(o => o.productIds !== null)
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  productIds: number[]; // Array of product IDs to associate with the category
}
