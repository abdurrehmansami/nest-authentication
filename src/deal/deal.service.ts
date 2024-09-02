import { Injectable,ConflictException, NotFoundException } from '@nestjs/common';
import { Product } from 'src/product/entities/product.entity';
import { In, Repository } from 'typeorm';
import { Deal } from './entities/deal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
@Injectable()
export class DealService {
    constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Deal)
    private dealsRepository: Repository<Deal>,
  ) {}

  async create(createDealDto: CreateDealDto): Promise<Deal> {
    // Fetch products by IDs
    const products = await this.productsRepository.findBy({ id: In(createDealDto.productIds) });
    if (products.length === 0) {
      throw new NotFoundException('No products found with the provided IDs');
    }
    // Create the deal
    const deal = this.dealsRepository.create({
      ...createDealDto,
      products: products,  // Associate products with the deal
    });
    // const deal = this.dealsRepository.create(createDealDto);
    return this.dealsRepository.save(deal);
  }

  async update(id: number, updateDealDto: UpdateDealDto): Promise<Deal> {
    // Find the existing deal by its ID
    const existingDeal = await this.dealsRepository.findOne({
      where: { dealId: id },
      relations: ['products'],  // Load related products
    });
  
    if (!existingDeal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }
  
    // Conditionally update the products relationship
    if (updateDealDto.productIds) {
      const products = await this.productsRepository.findBy({ id: In(updateDealDto.productIds) });
  
      if (products.length === 0) {
        throw new NotFoundException('No products found with the provided IDs');
      }
  
      // Update the products association
      existingDeal.products = products;
    }
  
    // Update other properties using the merge method
    this.dealsRepository.merge(existingDeal, updateDealDto);
  
    // Save the updated deal
    return this.dealsRepository.save(existingDeal);
  }
  

  async delete(id:number){
    await this.dealsRepository.delete({dealId:id})
    return this.dealsRepository.findBy({dealId:id})
  }

  async getDeals(){
    const deals = await this.dealsRepository.find({relations:['products']})
    return deals;
  }

  async getDealById(id:number){
    const dealOfId = await this.dealsRepository.find({where:{dealId:id}, relations:['products']})
    return dealOfId;
  }
}