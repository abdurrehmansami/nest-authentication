import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderProduct } from 'src/orderProduct/entities/orderPrdouct.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductsRepository: Repository<OrderProduct>,
    @InjectRepository(Product) // Inject the Product repository
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>, // Needed to update user points
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: User | null,
  ): Promise<Order> {
    const order = this.ordersRepository.create({
      totalPrice: createOrderDto.totalPrice,
      user: user ? user : null, // Attach user if available
    });
    const savedOrder = await this.ordersRepository.save(order);

    const orderProducts = await Promise.all(
      createOrderDto.orderProducts.map(async (cartItem) => {
        const product = await this.productRepository.findOneBy({
          id: cartItem.productId,
        });
        if (!product) {
          throw new Error(`Product with ID ${cartItem.productId} not found`);
        }
        const orderProduct = new OrderProduct();
        orderProduct.order = savedOrder;
        orderProduct.product = product;
        orderProduct.quantity = cartItem.quantity;
        orderProduct.price = cartItem.price;
        return orderProduct;
      }),
    );

    await this.orderProductsRepository.save(orderProducts);

    // If the user is logged in, update their points
    if (user) {
      user.points += Math.floor(savedOrder.totalPrice); // Example point calculation
      await this.userRepository.save(user); // Save the updated user points
    }
    return savedOrder;
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
