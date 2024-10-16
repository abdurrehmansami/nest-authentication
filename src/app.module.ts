import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { DealModule } from './deal/deal.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role.user.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AllExceptionsFilter } from './exception/http-exception.filter';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'order_online',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    ProductModule,
    DealModule,
    CategoryModule,
    OrderModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
