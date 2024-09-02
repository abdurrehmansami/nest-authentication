import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentModule } from './department/department.module';
import { ProductModule } from './product/product.module';
import { DealModule } from './deal/deal.module';
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
    DealModule
  ],
})
export class AppModule {}
