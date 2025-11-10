import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsInt()
  @IsNotEmpty()
  cabinId: number;

  @IsInt()
  @IsNotEmpty()
  guestId: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsInt()
  @IsNotEmpty()
  numGuests: number;

  @IsOptional()
  @IsBoolean()
  hasBreakfast: boolean;

  @IsOptional()
  @IsBoolean()
  isPaid: boolean;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}
