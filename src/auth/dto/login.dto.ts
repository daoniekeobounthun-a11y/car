import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
