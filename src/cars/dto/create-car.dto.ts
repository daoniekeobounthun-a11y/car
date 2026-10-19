import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

enum CarStatus {
    AVAILABLE = 'AVAILABLE',
    RENTED = 'RENTED',
    MAINTENANCE = 'MAINTENANCE',
}

export class CreateCarDto {
    @IsString()
    @IsNotEmpty()
    brand: string; // ຍີ່ຫໍ້ລົດ ເຊັ່ນ: Toyota, Honda

    @IsString()
    @IsNotEmpty()
    model: string; // ໂມເດວ ເຊັ່ນ: Camry, CR-V

    @IsString()
    @IsNotEmpty()
    plateNumber: string; // ເລກທະບຽນລົດ

    @IsEnum(CarStatus)
    @IsOptional()
    status?: CarStatus; // ສະຖານະ: AVAILABLE, RENTED, MAINTENANCE

    @IsNumber()
    @IsOptional()
    currentMileage?: number; // ເລກກິໂລແມັດປັດຈຸບັນ
}