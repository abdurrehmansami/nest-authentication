import { Controller, Post, Body, Param, Get, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {

constructor(private readonly orderService:OrderService){}


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