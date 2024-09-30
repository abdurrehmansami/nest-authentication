import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsUrl, ValidateIf, IsArray, ValidateNested, IsPositive } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';

class OrderProductDto {
  @IsNumber()
  @IsPositive()
  productId: number; 

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}

export class CreateOrderDto {
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  orderProducts: OrderProductDto[];

  @IsNumber()
  @IsPositive()
  totalPrice: number;

}
