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
import { MediaModule } from './media/media.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { FileUploadModule } from './file-upload/file-upload.module';
import { FileUploadController } from './file-upload/file-upload.controller';
import { FileUploadService } from './file-upload/file-upload.service';
// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'root',
//       password: '0336',
//       database: 'order_online',
//       entities: [__dirname + '/**/*.entity{.ts,.js}'],
//       synchronize: true, // Set to false in production
//     }),
//     AuthModule,
//     ProductModule,
//     DealModule,
//     CategoryModule,
//     OrderModule,
//     MediaModule,
//   ],
//   providers: [
//     { provide: APP_GUARD, useClass: JwtAuthGuard },
//     { provide: APP_GUARD, useClass: RolesGuard },
//     {
//       provide: APP_FILTER,
//       useClass: AllExceptionsFilter,
//     },
//   ],
// })
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'), // Fallback to 'localhost' if not set
        port: configService.get<number>('DB_PORT', 3306), // Fallback to 3306 if not set
        username: configService.get<string>('DB_USERNAME', 'root'), // Fallback to 'root' if not set
        password: configService.get<string>('DB_PASSWORD', ''), // Fallback to empty string if not set
        database: configService.get<string>('DB_DATABASE', 'order_online'), // Fallback to 'order_online' if not set
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false), // Set to false in production
      }),
    }),
    AuthModule,
    ProductModule,
    DealModule,
    CategoryModule,
    OrderModule,
    MediaModule,
    FileUploadModule,
  ],
  controllers:[AppController, FileUploadController],
  providers: [
     AppService,
     FileUploadService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
   
  ],
})
export class AppModule {}
