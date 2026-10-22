import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCarDto } from './dto/create-car.dto.js';
import { UpdateCarDto } from './dto/update-car.dto.js';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCarDto: CreateCarDto) {
    return await this.prisma.car.create({
      data: createCarDto,
    });
  }

  // ປັບໃຫ້ຮັບ Parameter status?: string
  async findAll(status?: string) {
    return await this.prisma.car.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const car = await this.prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນລົດ ID = ${id}`);
    }

    return car;
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    await this.findOne(id);

    return await this.prisma.car.update({
      where: { id },
      data: updateCarDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.car.delete({
      where: { id },
    });
  }
}