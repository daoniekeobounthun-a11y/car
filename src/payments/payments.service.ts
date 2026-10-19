import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';


@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) { }

  // 1. ສ້າງຂໍ້ມູນການຊຳລະເງິນ (ມັກຖືກເອີ້ນພ້ອມກັບການສ້າງ Booking)
  async create(dto: CreatePaymentDto) {
    const payment = await this.prisma.payment.create({
      data: {
        bookingId: dto.bookingId,
        amount: dto.amount,
        depositAmount: dto.depositAmount || 0.0,
        method: dto.method,
        status: 'PENDING',
      },
    });
    return { message: 'Payment record created successfully', payment };
  }

  // 2. ເບິ່ງລາຍຊື່ການຊຳລະເງິນທັງໝົດ
  async findAll() {
    return await this.prisma.payment.findMany({
      include: {
        booking: {
          include: {
            customer: true,
            car: true,
          },
        },
      },
    });
  }

  // 3. ເບິ່ງລາຍລະອຽດການຊຳລະເງິນຕາມ ID
  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            customer: true,
            car: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }
    return payment;
  }

  // 4. ອັບເດດສະຖານະການຊຳລະເງິນ ຫຼື ລະຫັດອ້າງອີງ
  async update(id: string, dto: UpdatePaymentDto) {
    await this.findOne(id);

    const updateData: any = { ...dto };

    // ຖ້າປ່ຽນສະຖານະເປັນ PAID ໃຫ້ບັນທຶກເວລາ paidAt ໄວ້ພ້ອມ
    if (dto.status === 'PAID') {
      updateData.paidAt = new Date();
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id },
      data: updateData,
    });

    return { message: 'Payment updated successfully', payment: updatedPayment };
  }

  // 5. ຟັງຊັນສຳລັບຄືນເງິນມັດຈຳ (Deposit Refund)
  async refundDeposit(id: string) {
    const payment = await this.findOne(id);

    const updatedPayment = await this.prisma.payment.update({
      where: { id },
      data: {
        isDepositRefunded: true,
      },
    });

    return { message: 'Deposit refunded successfully', payment: updatedPayment };
  }
}