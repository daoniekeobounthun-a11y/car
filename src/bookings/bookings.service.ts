import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateBookingDto, staffId?: number) {
    // 1. ກວດສອບ Customer (id ເປັນ number)
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });
    if (!customer) {
      throw new NotFoundException(`ບໍ່ພົບ Customer ID = ${dto.customerId}`);
    }

    // 2. ກວດສອບ Car (id ເປັນ number)
    const car = await this.prisma.car.findUnique({
      where: { id: dto.carId },
    });
    if (!car) {
      throw new NotFoundException(`ບໍ່ພົບ Car ID = ${dto.carId}`);
    }

    if (car.status !== 'AVAILABLE') {
      throw new BadRequestException('ລົດຄັນນີ້ບໍ່ພ້ອມໃຊ້ງານ ຫຼື ຖືກຈອງແລ້ວ');
    }

    const bookingCode = `BK-${Date.now()}`;

    // 3. ເປີດ Transaction ສ້າງ Booking ແລະ ອັບເດດ Status ລົດ
    return await this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          bookingCode,
          customerId: dto.customerId,
          carId: dto.carId,
          staffId: staffId ? Number(staffId) : null,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          totalAmount: dto.totalAmount,
          status: 'PENDING',
        },
      });

      await tx.car.update({
        where: { id: dto.carId },
        data: { status: 'RESERVED' },
      });

      return booking;
    });
  }

  async findAll() {
    return await this.prisma.booking.findMany({
      include: {
        customer: true,
        car: true,
        staff: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        car: true,
        staff: true,
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`ບໍ່ພົບ Booking ID = ${id}`);
    }

    return booking;
  }

  async cancel(id: number) {
    const booking = await this.findOne(id);

    return await this.prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      await tx.car.update({
        where: { id: booking.carId },
        data: { status: 'AVAILABLE' },
      });

      return updatedBooking;
    });
  }
}