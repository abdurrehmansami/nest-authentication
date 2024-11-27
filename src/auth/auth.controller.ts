import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Headers,
  Param,
  Patch,
  Query,
  ValidationPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AppService } from 'src/app.service';
import { Public } from 'src/public.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService,
  ) {}
  // constructor(private readonly appService: AppService) {}

  @Post('signup')
  @Public()
  async signup(@Body(ValidationPipe) signupDto: SignupDto) {
    const user = await this.authService.signup(
      signupDto.email,
      signupDto.password,
      signupDto.name,
    );
    return user;
  }
  @Public()
  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = (await this.authService.login(user)).access_token;
    // Set token in HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production', // Only use 'secure' in production
      // secure: false, // set to true in production over HTTPS
      // sameSite: 'none', // Prevent CSRF
      maxAge: 1 * 60000, //24 * 60 * 60 * 1000, // 1 day expiration
    });
    // Respond with success status
    return res.status(HttpStatus.OK).json({
      message: 'Logged in successfully',
      data: { email: user.email, name: user.name },
    });
  }
  @Get('getHello')
  async getHello(@Headers() headers) {
    console.log('HEADERS', headers);

    return this.appService.getHello();
  }
  @Public()
  @Get('users')
  async getUsers() {
    return this.authService.findAll();
  }
}
