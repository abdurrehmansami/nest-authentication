import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { DealService } from './deal.service';
import { CreateDealDto } from './dto/create-deal.dto';

@Controller('deal')
export class DealController {
    constructor(private readonly dealService: DealService) {}
    @Post()
    create(@Body(ValidationPipe) createDealDto: CreateDealDto) {
    return this.dealService.create(createDealDto);
  }
}