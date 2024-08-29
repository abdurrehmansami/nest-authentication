import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentModule } from './department/department.module';
@Module({
 
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '0336',
      database: 'nest_auth',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    DepartmentModule,
    // ProjectModule
  ],
})
export class AppModule {}
