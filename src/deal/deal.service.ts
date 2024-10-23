import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Product } from 'src/product/entities/product.entity';
import { In, Repository } from 'typeorm';
import { Deal } from './entities/deal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { QueryRunner } from 'typeorm';
@Injectable()
export class DealService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Deal)
    private dealsRepository: Repository<Deal>,
  ) {}

  async create(createDealDto: CreateDealDto): Promise<Deal> {
    const queryRunner =
      this.dealsRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      // Fetch products by IDs
      const products = await queryRunner.manager.findBy(Product, {
        id: In(createDealDto.productIds),
      });
      if (products.length === 0) {
        throw new NotFoundException('No products found with the provided IDs');
      }
      // let dealPrice = 0;
      // products.forEach((product) => (dealPrice += Number(product.price)));

      // Create the deal
      const deal = queryRunner.manager.create(Deal, {
        ...createDealDto,
        // price: dealPrice,
        products: products, // Associate products with the deal
      });
      // const deal = this.dealsRepository.create(createDealDto);
      const savedDeal = await queryRunner.manager.save(Deal, deal);
      await queryRunner.commitTransaction();
      return savedDeal;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  async update(id: number, updateDealDto: UpdateDealDto): Promise<Deal> {
    const queryRunner =
      this.dealsRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      // Find the existing deal by its ID
      const existingDeal = await queryRunner.manager.findOne(Deal, {
        where: { id: id },
        relations: ['products'], // Load related products
      });

      if (!existingDeal) {
        throw new NotFoundException(`Deal with ID ${id} not found`);
      }

      // Conditionally update the products relationship
      if (updateDealDto.productIds) {
        const products = await queryRunner.manager.findBy(Product, {
          id: In(updateDealDto.productIds),
        });

        if (products.length === 0) {
          throw new NotFoundException(
            'No products found with the provided IDs',
          );
        }

        // Update the products association
        existingDeal.products = products;
      }

      // Update other properties using the merge method
      queryRunner.manager.merge(Deal, existingDeal, updateDealDto);

      // Save the updated deal
      const updatedDeal = await queryRunner.manager.save(Deal, existingDeal);
      await queryRunner.commitTransaction();
      return updatedDeal;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  async delete(id: number): Promise<void> {
    const queryRunner =
      this.dealsRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.manager.delete(Deal, id);
      if (result.affected === 0) {
        throw new NotFoundException('Deal not found');
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  async getDeals(): Promise<Deal[]> {
    const deals = await this.dealsRepository.find({ relations: ['products'] });
    return deals;
  }

  async getDealById(id: number): Promise<Deal> {
    const dealOfId = await this.dealsRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!dealOfId) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }
    return dealOfId;
  }
}
