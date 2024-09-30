import { Controller, Post, Body, Param, Get, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {

constructor(private readonly orderService:OrderService){}


  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderDto);
  }

}

// | orderId    |
// | userId     |         
// | totalPrice |            
// | status     |            
// | createdAt  |

// |OrderProduct|
    
// | orderProdId|
// | orderId    |
// | productId  |
// | quantity   |
// | price      |