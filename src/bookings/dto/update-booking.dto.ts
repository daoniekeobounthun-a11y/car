import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto.js';
import { IsEnum, IsOptional } from 'class-validator';

enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    @IsEnum(BookingStatus)
    @IsOptional()
    status?: BookingStatus;
}