import { IsEnum, IsBoolean, IsOptional, IsString } from 'class-validator';

enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    REFUNDED = 'REFUNDED',
}

export class UpdatePaymentDto {
    @IsEnum(PaymentStatus)
    @IsOptional()
    status?: PaymentStatus;

    @IsString()
    @IsOptional()
    transactionRef?: string;

    @IsBoolean()
    @IsOptional()
    isDepositRefunded?: boolean;
}