import { Module } from '@nestjs/common';
import { CarsService } from './cars.service.js';
import { CarsController } from './cars.controller.js';

@Module({
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule { }