import { TypeOrmModule } from '@nestjs/typeorm';

import { Deal } from 'src/deal/entities/deal.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';
import { Module } from '@nestjs/common';
import { Category } from 'src/category/entities/category.entity';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderProduct } from 'src/orderProduct/entities/orderPrdouct.entity';
import { User } from 'src/auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PointHistory } from 'src/pointsHistory/entities/pointHistory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Product,
      Category,
      OrderProduct,
      Deal,
      User,
      PointHistory,
    ]),
  ],
  providers: [ProductService, OrderService, AuthService, JwtService],
  controllers: [OrderController],
})
export class OrderModule {}
