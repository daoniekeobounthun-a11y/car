import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) { }

  // 1. ເພີ່ມຂໍ້ມູນລູກຄ້າໃໝ່
  async create(dto: CreateCustomerDto) {
    const customer = await this.prisma.customer.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        idCardOrPassport: dto.idCardOrPassport,
        driverLicense: dto.driverLicense,
        isBlacklisted: dto.isBlacklisted || false,
      },
    });
    return { message: 'Customer created successfully', customer };
  }

  // 2. ດຶງລາຍຊື່ລູກຄ້າທັງໝົດ
  async findAll() {
    return await this.prisma.customer.findMany({
      include: {
        bookings: true, // ດຶງປະຫວັດການຈອງລົດມາພ້ອມ
      },
    });
  }

  // 3. ດຶງຂໍ້ມູນລູກຄ້າຕາມ ID
  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            car: true,
            payment: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  // 4. ອັບເດດຂໍ້ມູນລູກຄ້າ
  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id); // ກວດສອບວ່າພົບລູກຄ້າหรือไม่

    const updatedCustomer = await this.prisma.customer.update({
      where: { id },
      data: dto,
    });

    return { message: 'Customer updated successfully', customer: updatedCustomer };
  }

  // 5. ຈັດການສະຖານະ Blacklist (ສຳລັບລູກຄ້າທີ່ມີບັນຫາ)
  async toggleBlacklist(id: string) {
    const customer = await this.findOne(id);

    const updatedCustomer = await this.prisma.customer.update({
      where: { id },
      data: {
        isBlacklisted: !customer.isBlacklisted,
      },
    });

    return {
      message: `Customer blacklist status updated to ${updatedCustomer.isBlacklisted}`,
      customer: updatedCustomer
    };
  }

  // 6. ລຶບຂໍ້ມູນລູກຄ້າ
  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.customer.delete({
      where: { id },
    });

    return { message: 'Customer deleted successfully' };
  }
}