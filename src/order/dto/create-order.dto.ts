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
} from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Order } from '../entities/order.entity';

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

  constructor(order: Order) {
    this.totalPrice = order.totalPrice;
    this.orderProducts = order.orderProducts.map((op) => ({
      productId: op.product?.id,
      price: op.price,
      quantity: op.quantity,
    }));
    // this.user = employee.user ? new UserDto(employee.user) : null;
    // this.weeklyHour = employee.weeklyHour;
    // this.designation = employee?.designation;
    // this.head = employee.head ? new EmployeeDto(employee.head) : null;
    // this.workingDays = employee.workingDays;
    // this.employeeId = employee.employeeId;
    // this.department = employee.department;
    // this.employeeType = employee.employeeType?.name;
    // this.joiningDate = employee.joiningDate;
    // this.workMode = employee.workMode?.name;
    // this.skypeId = employee.skypeId;
    // this.isHead = employee.isHead;
  }
}
