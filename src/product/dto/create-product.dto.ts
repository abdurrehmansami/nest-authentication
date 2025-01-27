import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  ValidateIf,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { CreateMediaDto } from 'src/media/dto/create-media.dto';

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

   @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // Validate each object in the array
  @Type(() => CreateMediaDto) // Specify the type for transformation
  images?: CreateMediaDto[];
}

export class ProductDto extends PartialType(CreateProductDto) {
  id: number;
}
