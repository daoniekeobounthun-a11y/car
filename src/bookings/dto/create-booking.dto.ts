import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional, IsEnum } from 'class-validator';

enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty()
    customerId: string; // ລະຫັດລູກຄ້າ

    @IsString()
    @IsNotEmpty()
    carId: string; // ລະຫັດລົດທີ່ຕ້ອງການເຊົ່າ

    @IsDateString()
    @IsNotEmpty()
    startDate: string; // ວັນທີເລີ່ມເຊົ່າ

    @IsDateString()
    @IsNotEmpty()
    endDate: string; // ວັນທີສິ້ນສຸດການເຊົ່າ

    @IsNumber()
    @IsNotEmpty()
    totalAmount: number; // ລາຄາລວມທັງໝົດ

    @IsEnum(BookingStatus)
    @IsOptional()
    status?: BookingStatus; // ສະຖານະການຈອງ
}