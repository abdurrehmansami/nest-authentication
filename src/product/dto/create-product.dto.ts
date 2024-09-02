import { IsString, IsNumber, IsOptional, IsUrl, ValidateIf } from 'class-validator';

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

  @ValidateIf(o => o.categoryId !== null)
  @IsNumber()
  categoryId: number | null;
}
