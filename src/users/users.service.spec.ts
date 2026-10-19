import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { vi } from 'vitest';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

// Mock bcryptjs ດ້ວຍ Vitest
vi.mock('bcryptjs');

// ຂໍ້ມູນ Mock User ສຳລັບການທົດສອບ
const mockUser = {
  id: 'user-uuid-1',
  name: 'Test User',
  email: 'test@example.com',
  phone: '020-0000-0000',
  role: 'STAFF',
  createdAt: new Date('2026-01-01'),
};

const mockUserWithPassword = {
  ...mockUser,
  password: 'hashed_old_password',
};

// Mock PrismaService
const mockPrismaService = {
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Reset mocks ທຸກຄັ້ງກ່ອນ test
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── 1. findAll ────────────────────────────────────────────────────────────
  describe('findAll()', () => {
    it('ຄວນ return ລາຍຊື່ຜູ້ໃຊ້ທັງໝົດ', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(result).toEqual([mockUser]);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });
    });

    it('ຄວນ return array ຫວ່າງ ຖ້າບໍ່ມີຜູ້ໃຊ້', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ─── 2. findOne ────────────────────────────────────────────────────────────
  describe('findOne()', () => {
    it('ຄວນ return ຜູ້ໃຊ້ ຖ້າພົບ ID', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('user-uuid-1');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });
    });

    it('ຄວນ throw NotFoundException ຖ້າບໍ່ພົບ ID', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });
  });

  // ─── 3. update ─────────────────────────────────────────────────────────────
  describe('update()', () => {
    const updateDto = { name: 'Updated Name', phone: '020-9999-9999' };
    const updatedUser = { ...mockUser, name: 'Updated Name', phone: '020-9999-9999' };

    it('ຄວນ update ຂໍ້ມູນຜູ້ໃຊ້ ແລະ return ຂໍ້ຄວາມສຳເລັດ', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update('user-uuid-1', updateDto);

      expect(result).toEqual({
        message: 'User updated successfully',
        user: updatedUser,
      });
      expect(mockPrismaService.user.update).toHaveBeenCalledTimes(1);
    });

    it('ຄວນ throw NotFoundException ຖ້າ User ບໍ່ພົບ', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.update('invalid-id', updateDto)).rejects.toThrow(
        new NotFoundException('User not found'),
      );

      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });

    it('ຄວນສົ່ງສະເພາະ field ທີ່ຖືກກຳນົດໄປ Prisma (ບໍ່ລວມ undefined)', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      // ສົ່ງ DTO ທີ່ມີ field ດຽວ (phone/email/role ເປັນ undefined)
      await service.update('user-uuid-1', { name: 'New Name' });

      const callArgs = mockPrismaService.user.update.mock.calls[0][0];
      expect(callArgs.data).toEqual({ name: 'New Name' });
    });
  });

  // ─── 4. changePassword ─────────────────────────────────────────────────────
  describe('changePassword()', () => {
    const changePasswordDto = {
      oldPassword: 'old_password',
      newPassword: 'new_password_123',
    };

    it('ຄວນປ່ຽນລະຫັດຜ່ານສຳເລັດ', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserWithPassword);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed_new_password' as never);
      mockPrismaService.user.update.mockResolvedValue(undefined);

      const result = await service.changePassword('user-uuid-1', changePasswordDto);

      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(bcrypt.compare).toHaveBeenCalledWith('old_password', 'hashed_old_password');
      expect(bcrypt.hash).toHaveBeenCalledWith('new_password_123', 10);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1' },
        data: { password: 'hashed_new_password' },
      });
    });

    it('ຄວນ throw NotFoundException ຖ້າ User ບໍ່ພົບ', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword('invalid-id', changePasswordDto),
      ).rejects.toThrow(new NotFoundException('User not found'));

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('ຄວນ throw BadRequestException ຖ້າລະຫັດຜ່ານເກົ່າບໍ່ຖືກຕ້ອງ', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUserWithPassword);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        service.changePassword('user-uuid-1', changePasswordDto),
      ).rejects.toThrow(new BadRequestException('Old password is incorrect'));

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });
  });

  // ─── 5. remove ─────────────────────────────────────────────────────────────
  describe('remove()', () => {
    it('ຄວນລຶບຜູ້ໃຊ້ ແລະ return ຂໍ້ຄວາມສຳເລັດ', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.delete.mockResolvedValue(undefined);

      const result = await service.remove('user-uuid-1');

      expect(result).toEqual({ message: 'User deleted successfully' });
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1' },
      });
    });

    it('ຄວນ throw NotFoundException ຖ້າ User ບໍ່ພົບ', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        new NotFoundException('User not found'),
      );

      expect(mockPrismaService.user.delete).not.toHaveBeenCalled();
    });
  });
});