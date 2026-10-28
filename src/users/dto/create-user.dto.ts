import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'ກະລຸນາປ້ອນຊື່' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'ກະລຸນາປ້ອນອີເມວ' })
  @IsEmail({}, { message: 'ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ' })
  email: string;

  @IsNotEmpty({ message: 'ກະລຸນາປ້ອນລະຫັດຜ່ານ' })
  @IsString()
  @MinLength(6, { message: 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ' })
  password: string;

  @IsOptional()
  @IsString()
  role?: string;
}
