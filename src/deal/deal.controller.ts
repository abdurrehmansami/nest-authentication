import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { DealService } from './deal.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';

@Controller('deal')
export class DealController {
    constructor(private readonly dealService: DealService) {}
    @Post()
    async create(@Body(ValidationPipe) createDealDto: CreateDealDto) {
      const createdDeal = await this.dealService.create(createDealDto);
      return createdDeal;
  }
    @Patch(':id')
    async update(@Param('id',ParseIntPipe) id: number, @Body(ValidationPipe) updateDealDto: UpdateDealDto) {
     const updatedDeal =  await this.dealService.update(id, updateDealDto);
     return updatedDeal;
    }

    @Delete(':id')
    async delete(@Param('id',ParseIntPipe) id: number){
      const deletedDeal = await this.dealService.delete(id)
    }

    @Get()
    async getDeals(){
      const deals = await this.dealService.getDeals()
      return deals
    }

    @Get(':id')
    async getDealById(@Param('id',ParseIntPipe) id:number){
      const dealOfId = this.dealService.getDealById(id)
      return dealOfId;
    }

}