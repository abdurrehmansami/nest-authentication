import { Controller, Post, Body, Param, Get, ValidationPipe, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/jwt-auth.guard';
import { User } from 'src/auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
export interface AuthenticatedRequest extends Request {
  user: User; // Declare that the user will be attached to the request
}
@Controller('orders')
export class OrderController {

constructor(private readonly orderService:OrderService,private readonly userService:AuthService){}


  // @Post()
  // async createOrder(@Body() createOrderDto: CreateOrderDto) {
  //   return await this.orderService.createOrder(createOrderDto);
  // }
    // Protected route for authenticated users
    @UseGuards(JwtAuthGuard)
    @Post('user')
    async createOrderAsUser(@Body() createOrderDto: CreateOrderDto, @Req() req: AuthenticatedRequest) {
      // const user = req.user;  // Extract user info from request
      const user = await this.userService.findOne(req.user.email)
      return await this.orderService.createOrder(createOrderDto, user);
    }
  
    // Public route for guests
    @Post('guest')
    async createOrderAsGuest(@Body() createOrderDto: CreateOrderDto) {
      return await this.orderService.createOrder(createOrderDto, null);
    }

}

