import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateBookingDto {
    @IsNotEmpty({ message: 'ກະລຸນາປ້ອນ customerId' })
    @IsInt()
    customerId: number;

    @IsNotEmpty({ message: 'ກະລຸນາປ້ອນ carId' })
    @IsInt()
    carId: number;

    @IsNotEmpty({ message: 'ກະລຸນາປ້ອນວັນເລີ່ມຕົ້ນເຊົ່າ' })
    @IsDateString()
    startDate: string;

    @IsNotEmpty({ message: 'ກະລຸນາປ້ອນວັນສິ້ນສຸດເຊົ່າ' })
    @IsDateString()
    endDate: string;

    @IsNotEmpty({ message: 'ກະລຸນາປ້ອນລາຄາລວມ' })
    @IsNumber()
    totalAmount: number;
}