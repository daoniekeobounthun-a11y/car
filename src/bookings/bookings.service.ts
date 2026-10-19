import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) { }

  // 1. ສ້າງການຈອງລົດໃໝ່
  async create(dto: CreateBookingDto, staffId: string) {
    // ກວດສອບວ່າລູກຄ້າໃນລະບົບມີຕົວຕົນ ແລະ ບໍ່ໄດ້ຖືກ Blacklist
    const customer = await this.prisma.customer.findUnique({
      where: { id: dto.customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    if (customer.isBlacklisted) {
      throw new BadRequestException('This customer is blacklisted and cannot rent a car');
    }

    // ກວດສອບວ່າລົດມີຕົວຕົນ ແລະ ພ້ອມໃຫ້ເຊົ່າ (AVAILABLE)
    const car = await this.prisma.car.findUnique({
      where: { id: dto.carId },
    });
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    if (car.status !== 'AVAILABLE') {
      throw new BadRequestException('Car is not available for rent');
    }

    // ສ້າງລະຫັດການຈອງອັດຕະໂນມັດ ຕົວຢ່າງ: BKG-1718293
    const bookingCode = `BKG-${Date.now().toString().slice(-6)}`;

    // ໃຊ້ Transaction ເພື່ອບັນທຶກການຈອງ ແລະ ອັບເດດສະຖານະລົດເປັນ RENTED ພ້ອມກັນ
    const result = await this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          bookingCode,
          customerId: dto.customerId,
          carId: dto.carId,
          staffId, // ພະນັກງານທີ່ทำรายการ
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          totalAmount: dto.totalAmount,
          status: dto.status || 'CONFIRMED',
        },
      });

      // ປ່ຽນສະຖານະລົດເປັນ RENTED
      await tx.car.update({
        where: { id: dto.carId },
        data: { status: 'RENTED' },
      });

      return booking;
    });

    return { message: 'Booking created successfully', booking: result };
  }

  // 2. ດຶງລາຍຊື່ການຈອງທັງໝົດ
  async findAll() {
    return await this.prisma.booking.findMany({
      include: {
        customer: true,
        car: true,
        staff: { select: { id: true, name: true, email: true } },
        payment: true,
      },
    });
  }

  // 3. ດຶງຂໍ້ມູນການຈອງຕາມ ID
  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        car: true,
        staff: { select: { id: true, name: true, email: true } },
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  // 4. ອັບເດດຂໍ້ມູນການຈອງ (ຖ້າປ່ຽນສະຖານະເປັນ COMPLETED ຫຼື CANCELLED ຈະປົດປ່ອຍລົດໃຫ້ກັບມາ AVAILABLE)
  async update(id: string, dto: UpdateBookingDto) {
    const booking = await this.findOne(id);

    const updatedBooking = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: {
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          endDate: dto.endDate ? new Date(dto.endDate) : undefined,
          totalAmount: dto.totalAmount,
          status: dto.status,
        },
      });

      // ຖ້າການຈອງສຳເລັດ ຫຼື ຖືກຍົກເລີກ ໃຫ້ປ່ຽນສະຖານະລົດກັບຄືນເປັນ AVAILABLE
      if (dto.status === 'COMPLETED' || dto.status === 'CANCELLED') {
        await tx.car.update({
          where: { id: booking.carId },
          data: { status: 'AVAILABLE' },
        });
      }

      return updated;
    });

    return { message: 'Booking updated successfully', booking: updatedBooking };
  }

  // 5. ລຶບການຈອງ ແລະ ປົດປ່ອຍລົດ
  async remove(id: string) {
    const booking = await this.findOne(id);

    await this.prisma.$transaction(async (tx) => {
      await tx.car.update({
        where: { id: booking.carId },
        data: { status: 'AVAILABLE' },
      });

      await tx.booking.delete({
        where: { id },
      });
    });

    return { message: 'Booking deleted successfully' };
  }
}