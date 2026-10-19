import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';

enum PaymentMethod {
    CASH = 'CASH',
    QR_CODE = 'QR_CODE',
    CREDIT_CARD = 'CREDIT_CARD',
}

export class CreatePaymentDto {
    @IsString()
    @IsNotEmpty()
    bookingId: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsNumber()
    @IsOptional()
    depositAmount?: number;

    @IsEnum(PaymentMethod)
    method: PaymentMethod;
}