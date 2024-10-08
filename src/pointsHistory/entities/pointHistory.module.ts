import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';
import { OrderController } from 'src/order/order.controller';
import { OrderService } from 'src/order/order.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, JwtService],
  controllers: [],
})
export class OrderModule {}
