import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreatePaymentDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນການຈອງ ID = ${dto.bookingId}`);
    }

    return await this.prisma.payment.create({
      data: {
        bookingId: dto.bookingId,
        amount: dto.amount,
        depositAmount: dto.depositAmount ?? 0.0,
        method: dto.method,
        transactionRef: dto.transactionRef,
        status: 'PAID',
        paidAt: new Date(),
      },
    });
  }

  async findAll() {
    return await this.prisma.payment.findMany({
      include: { booking: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!payment) {
      throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນການຊຳລະເງິນ ID = ${id}`);
    }

    return payment;
  }

  async update(id: number, dto: UpdatePaymentDto) {
    await this.findOne(id);

    return await this.prisma.payment.update({
      where: { id },
      data: dto,
    });
  }

  // ເພີ່ມ Method refundDeposit ທີ່ນີ້
  async refundDeposit(id: number) {
    await this.findOne(id);

    return await this.prisma.payment.update({
      where: { id },
      data: { isDepositRefunded: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.payment.delete({
      where: { id },
    });
  }
}