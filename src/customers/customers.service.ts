import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) { }

  // ==================== 1. ສ້າງຂໍ້ມູນລູກຄ້າ ====================
  async create(createCustomerDto: CreateCustomerDto) {
    const { phone, idCardOrPassport, driverLicense } = createCustomerDto;

    // ກວດສອບຂໍ້ມູນຊ້ຳ (phone, idCard, driverLicense)
    const existingCustomer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          { phone },
          { idCardOrPassport },
          { driverLicense },
        ],
      },
    });

    if (existingCustomer) {
      throw new ConflictException(
        'ເບີໂທ, ບັດປະຈຳຕົວ/Passport ຫຼື ໃບຂັບຂີ່ ນີ້ມີຢູ່ໃນລະບົບແລ້ວ',
      );
    }

    return await this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  // ==================== 2. ດຶງຂໍ້ມູນລູກຄ້າທັງໝົດ ====================
  async findAll() {
    return await this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ==================== 3. ດຶງຂໍ້ມູນລູກຄ້າຕາມ ID (Int) ====================
  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        bookings: true, // ດຶງປະວັດການຈອງຂອງລູກຄ່ານີ້ມາພ້ອມ
      },
    });

    if (!customer) {
      throw new NotFoundException(`ບໍ່ພົບຂໍ້ມູນລູກຄ້າ ID = ${id}`);
    }

    return customer;
  }

  // ==================== 4. ອັບເດດຂໍ້ມູນລູກຄ້າ ====================
  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id); // ກວດສອບກ່ອນວ່າ ID ນີ້ມີຢູ່ແທ້ບໍ

    return await this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  // ==================== 5. ລົບຂໍ້ມູນລູກຄ້າ ====================
  async remove(id: number) {
    await this.findOne(id); // ກວດສອບກ່ອນວ່າ ID ນີ້ມີຢູ່ແທ້ບໍ

    return await this.prisma.customer.delete({
      where: { id },
    });
  }
}