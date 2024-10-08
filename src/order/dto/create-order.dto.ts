import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  ValidateIf,
  IsArray,
  ValidateNested,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { User } from 'src/auth/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Order } from '../entities/order.entity';
import { UserDto } from 'src/auth/dto/user.dto';
import { OrderProduct } from 'src/orderProduct/entities/orderPrdouct.entity';

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

  constructor(orderProduct: OrderProduct) {
    this.price = orderProduct.price;
    this.quantity = orderProduct.quantity;
    this.productId = orderProduct.product.id;
  }
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  orderProducts: OrderProductDto[];

  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @IsNotEmpty()
  @IsString()
  pointType: string;

  pointsRedeemed: number | null;

  constructor(order: Order) {
    this.totalPrice = order.totalPrice;
    this.orderProducts = order.orderProducts.map((op) => ({
      productId: op.product?.id,
      price: op.price,
      quantity: op.quantity,
    }));
  }
}
export class OrderDto {
  id: number;
  status: string;
  createdAt: Date;
  totalPrice: number;
  user: UserDto | null;
  orderProducts: OrderProductDto[];

  constructor(order: Order) {
    this.createdAt = order.createdAt;
    this.id = order.id;
    this.status = order.status;
    this.user = order.user ? new UserDto(order.user) : null;
    this.totalPrice = order.totalPrice;
    // Map over the orderProducts array to convert each to OrderProductDto
    this.orderProducts = order.orderProducts.map(
      (orderProduct) => new OrderProductDto(orderProduct),
    );
  }
}
