import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  // 1. ເບິ່ງລາຍຊື່ຜູ້ໃຊ້ທັງໝົດ
  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return users;
  }

  // 2. ເບິ່ງຂໍ້ມູນຜູ້ໃຊ້ຕາມ ID
  async findOne(id: string) {
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
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // 3. ແກ້ໄຂຂໍ້ມູນຜູ້ໃຊ້
  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id); // ກວດສອບວ່າພົບ User ຫຼືບໍ່

    // ກອງສະເພາະ field ທີ່ຖືກກຳນົດ (ບໍ່ລວມ undefined)
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data['name'] = dto.name;
    if (dto.email !== undefined) data['email'] = dto.email;
    if (dto.role !== undefined) data['role'] = dto.role;

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return { message: 'User updated successfully', user: updatedUser };
  }

  // 4. ປ່ຽນລະຫັດຜ່ານ
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ກວດສອບລະຫັດຜ່ານເກົ່າ
    const isPasswordValid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    // Hash ລະຫັດຜ່ານໃໝ່
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  // 5. ລຶບຜູ້ໃຊ້
  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}