import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderProduct } from 'src/orderProduct/entities/orderPrdouct.entity';
import { CreateOrderDto, OrderDto } from './dto/create-order.dto';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/auth/entities/user.entity';
import { PointHistory } from 'src/pointsHistory/entities/pointHistory.entity';
import { type } from 'src/pointsHistory/entities/type.enum';

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
    @InjectRepository(PointHistory)
    private pointHistoryRepository: Repository<PointHistory>, // Needed to update user points
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: User | null,
  ): Promise<OrderDto> {
    let tp = 0;
    const orderProducts = await Promise.all(
      createOrderDto.orderProducts.map(async (cartItem) => {
        tp += cartItem.price * cartItem.quantity;
        const product = await this.productRepository.findOneBy({
          id: cartItem.productId,
        });
        if (!product) {
          throw new Error(`Product with ID ${cartItem.productId} not found`);
        }
        const orderProduct = new OrderProduct();
        // orderProduct.order = savedOrder;
        orderProduct.product = product;
        orderProduct.quantity = cartItem.quantity;
        orderProduct.price = cartItem.price;
        return orderProduct;
      }),
    );
    let updatedUser = null;
    if (user) {
      const pointsEarned = Math.floor(tp); // Calculate points earned from the order
      const pointsRedeemed = createOrderDto.pointsRedeemed; // Assume points redeemed comes from the DTO

      // Adjust user points
      user.points += pointsEarned; // Add earned points
      if (pointsRedeemed) {
        user.points -= pointsRedeemed; // Subtract redeemed points
      }
      updatedUser = await this.userRepository.save(user); // Save the updated user points

      // Save PointHistory for earned points
      const pointHistoryEarned = this.pointHistoryRepository.create({
        user: updatedUser,
        points: pointsEarned,
        type: type.EARNED,
      });
      await this.pointHistoryRepository.save(pointHistoryEarned);
      if (pointsRedeemed) {
        // Save PointHistory for redeemed points
        const pointHistoryRedeemed = this.pointHistoryRepository.create({
          user: updatedUser,
          points: pointsRedeemed,
          type: type.REDEEMED,
        });
        await this.pointHistoryRepository.save(pointHistoryRedeemed);
      }
    }
    const order = this.ordersRepository.create({
      totalPrice: tp,
      user: user ? updatedUser : null, // Attach user if available
    });
    // If the user is logged in, update their points

    const savedOrder = await this.ordersRepository.save(order);
    orderProducts.forEach((op) => (op.order = savedOrder));
    await this.orderProductsRepository.save(orderProducts);

    const finalOrder = await this.ordersRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['orderProducts', 'orderProducts.product', 'user'], // Load the necessary relations
    });
    // Return the DTO with the finalOrder, including orderProducts
    return new OrderDto(finalOrder);
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
