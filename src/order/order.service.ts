import { Injectable,ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderProduct } from 'src/orderProduct/entities/orderPrdouct.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { log } from 'console';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductsRepository: Repository<OrderProduct>,
    @InjectRepository(Product) // Inject the Product repository
    private readonly productRepository: Repository<Product>,
  ) { }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    console.log('create order', createOrderDto);
    const order = this.ordersRepository.create(createOrderDto)
    const savedOrder = await this.ordersRepository.save(order);
   console.log('saved', savedOrder);

   console.log('orde', order);
   
   
    
    const orderProducts = await Promise.all( createOrderDto.orderProducts.map(async(cartItem) => {
      const product = await this.productRepository.findOneBy({id:cartItem.productId});
        if (!product) {
          throw new Error(`Product with ID ${cartItem.productId} not found`);
        }
      const orderProduct = new OrderProduct();
      orderProduct.order = savedOrder;
      orderProduct.product = product;
      orderProduct.quantity = cartItem.quantity;
      orderProduct.price = cartItem.price;
      return orderProduct;
    }));
    await this.orderProductsRepository.save(orderProducts);
    return savedOrder

    }
    
    }

    // SAMPLE PAYLOAD FOR CREATE ORDER:
    // {
    //   "orderProducts": [
    //     {
    //       "productId": 1,
    //       "quantity": 2
    //     },
    //     {
    //       "productId": 2,
    //       "quantity": 1
    //     }
    //   ],
    //   "totalPrice": 29.99
    // }
    
