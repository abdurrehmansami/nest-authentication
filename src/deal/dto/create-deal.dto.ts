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
import { Optional } from '@nestjs/common';

export class CreateDealDto {
  // @ValidateIf((o) => o.discount !== null)
  // @IsOptional()
  // @IsNotEmpty()
  // @IsNumber()
  // discount: number | null;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  productIds: number[]; // Array of product IDs to associate with the deal
}
