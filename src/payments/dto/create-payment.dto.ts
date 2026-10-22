import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
    @IsNotEmpty({ message: 'ກະລຸນາປ້ອນ bookingId' })
    @IsInt()
    bookingId: number; // ປ່ຽນເປັນ number

    @IsNotEmpty({ message: 'ກະລຸນາປ້ອນຈຳນວນເງິນ' })
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsNumber()
    depositAmount?: number;

    @IsNotEmpty({ message: 'ກະລຸນາລະບຸວິທີການຊຳລະເງິນ' })
    @IsString()
    method: string;

    @IsOptional()
    @IsString()
    transactionRef?: string;
}