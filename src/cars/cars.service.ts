import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCarDto } from './dto/create-car.dto.js';
import { UpdateCarDto } from './dto/update-car.dto.js';

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) { }

  // 1. ເພີ່ມຂໍ້ມູນລົດໃໝ່
  async create(dto: CreateCarDto) {
    const car = await this.prisma.car.create({
      data: {
        brand: dto.brand,
        model: dto.model,
        plateNumber: dto.plateNumber,
        status: dto.status || 'AVAILABLE',
        currentMileage: dto.currentMileage || 0,
      },
    });
    return { message: 'Car created successfully', car };
  }

  // 2. ດຶງລາຍຊື່ລົດທັງໝົດ (ສາມາດກອງຕາມສະຖານະໄດ້)
  async findAll(status?: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE') {
    return await this.prisma.car.findMany({
      where: status ? { status } : undefined,
      include: {
        bookings: true, // ດຶງປະຫວັດການຈອງລົດຄັນນີ້ມາພ້ອມ
      },
    });
  }

  // 3. ດຶງຂໍ້ມູນລົດຕາມ ID
  async findOne(id: string) {
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            customer: true,
            payment: true,
          },
        },
      },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }
    return car;
  }

  // 4. ອັບເດດຂໍ້ມູນລົດ (ເຊັ່ນ: ປ່ຽນສະຖານະ, ປ່ຽນເລກກິໂລ)
  async update(id: string, dto: UpdateCarDto) {
    await this.findOne(id); // ກວດສອບວ່າພົບລົດຄັນນີ້ຫຼືບໍ່

    const updatedCar = await this.prisma.car.update({
      where: { id },
      data: dto,
    });

    return { message: 'Car updated successfully', car: updatedCar };
  }

  // 5. ລຶບຂໍ້ມູນລົດ
  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.car.delete({
      where: { id },
    });

    return { message: 'Car deleted successfully' };
  }
}