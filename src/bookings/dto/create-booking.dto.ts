import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'ກະລຸນາປ້ອນ customerId' })
  @Type(() => Number)
  @IsInt({ message: 'customerId ຕ້ອງເປັນຈຳນວນຖ້ວນ (integer)' })
  customerId: number;

  @IsNotEmpty({ message: 'ກະລຸນາປ້ອນ carId' })
  @Type(() => Number)
  @IsInt({ message: 'carId ຕ້ອງເປັນຈຳນວນຖ້ວນ (integer)' })
  carId: number;

  @IsNotEmpty({ message: 'ກະລຸນາປ້ອນວັນເລີ່ມຕົ້ນເຊົ່າ' })
  @IsDateString({}, { message: 'startDate ຕ້ອງເປັນຮູບແບບວັນທີ ISO (ເຊັ່ນ: 2026-10-20T09:00:00.000Z)' })
  startDate: string;

  @IsNotEmpty({ message: 'ກະລຸນາປ້ອນວັນສິ້ນສຸດເຊົ່າ' })
  @IsDateString({}, { message: 'endDate ຕ້ອງເປັນຮູບແບບວັນທີ ISO (ເຊັ່ນ: 2026-10-22T09:00:00.000Z)' })
  endDate: string;

  @IsNotEmpty({ message: 'ກະລຸນາປ້ອນລາຄາລວມ' })
  @Type(() => Number)
  @IsNumber({}, { message: 'totalAmount ຕ້ອງເປັນຕົວເລກ' })
  totalAmount: number;
}