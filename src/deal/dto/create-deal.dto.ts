import { IsNotEmpty, IsNumber, IsDate, ArrayNotEmpty, ArrayMinSize, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDealDto {
  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  productIds: number[];  // Array of product IDs to associate with the deal
}
