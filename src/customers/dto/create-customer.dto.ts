import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
    @IsNotEmpty({ message: 'ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ' })
    @IsString()
    fullName: string;

    @IsNotEmpty({ message: 'ກະລຸນາປ້ອນເບີໂທລະສັບ' })
    @IsString()
    phone: string;

    @IsNotEmpty({ message: 'ກະລຸນາປ້ອນເລກບັດປະຈຳຕົວ ຫຼື ໜັງສືຜ່ານແດນ' })
    @IsString()
    idCardOrPassport: string;

    @IsNotEmpty({ message: 'ກະລຸນາປ້ອນເລກໃບຂັບຂີ່' })
    @IsString()
    driverLicense: string;

    @IsOptional()
    @IsBoolean()
    isBlacklisted?: boolean;
}