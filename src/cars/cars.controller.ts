import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CarsService } from './cars.service.js';
import { CreateCarDto } from './dto/create-car.dto.js';
import { UpdateCarDto } from './dto/update-car.dto.js';

@Controller('api/cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) { }

  @Post()
  create(@Body() dto: CreateCarDto) {
    return this.carsService.create(dto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.carsService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCarDto,
  ) {
    return this.carsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carsService.remove(id);
  }
}