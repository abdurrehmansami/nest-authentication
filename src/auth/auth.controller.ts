import { Controller, Post, Body, UnauthorizedException, Get, Headers, Param, Patch, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AppService } from 'src/app.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,private readonly appService: AppService) {}
  // constructor(private readonly appService: AppService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.authService.signup(signupDto.email, signupDto.password);
    return user;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
  @Get('getHello')
  async getHello(@Headers() headers){
    console.log('HEADERS',headers);
    
    return this.appService.getHello()
  
  }
  // without sevices
  /*
  Get /auth/users
  Get /auth/:id
  Post /auth
  patch /users/:id
  delete /users/:id
  */
 
  @Get()  //  /auth
  findAll(){
    return []
  }
  @Get(':id')  //  /auth?role=value with query params
  find(@Query('role') role?:'intern'|'manager'){
    return [role]
  }
  @Get(':id') //  /auth/id  
  findOne(@Param('id') id:string){
    return {id}
  }
  @Post() //  /auth
  createOne(@Body() auth:{}){
    return auth;
  }
  @Patch(':id') //  /auth/id  
  updateOne(@Param('id') id:string, @Body() auth:{}){
    return {id, auth}
  }
}
