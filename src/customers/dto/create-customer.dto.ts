import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    idCardOrPassport: string;

    @IsString()
    @IsNotEmpty()
    driverLicense: string;

    @IsBoolean()
    @IsOptional()
    isBlacklisted?: boolean;
}