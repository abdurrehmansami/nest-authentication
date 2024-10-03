import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User } from './entities/user.entity';
import { AppService } from 'src/app.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'your-secret-key', // Use a more secure secret key in production
      signOptions: { expiresIn: '10m' }, // Token expires in 60 minutes
    }),
    PassportModule,
  ], 
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AppService],
})
export class AuthModule {}
