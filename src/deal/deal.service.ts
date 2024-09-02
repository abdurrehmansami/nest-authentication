import { Injectable,ConflictException, NotFoundException } from '@nestjs/common';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { Deal } from './entities/deal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDealDto } from './dto/create-deal.dto';
@Injectable()
export class DealService {
    constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Deal)
    private dealsRepository: Repository<Deal>,
  ) {}

  async create(createDealDto: CreateDealDto): Promise<Deal> {
    const deal = this.dealsRepository.create(createDealDto);
    return this.dealsRepository.save(deal);
  }
}