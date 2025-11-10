import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSettingDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  minBookingLength: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  maxBookingLength: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  maxGuestsPerBooking: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  breakfastPrice: number;
}
