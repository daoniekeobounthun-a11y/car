import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`ບໍ່ພົບ User ID = ${id}`);
    }

    return user;
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('ບໍ່ພົບຜູ້ໃຊ້ໃນລະບົບ');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('ລະຫັດຜ່ານເກົ່າບໍ່ຖືກຕ້ອງ');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    return await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    return await this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.user.delete({
      where: { id },
    });
  }
}