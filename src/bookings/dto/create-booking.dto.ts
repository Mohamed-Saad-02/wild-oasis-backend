import { BadRequestException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @IsNotEmpty()
  cabinId: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => {
    const date = new Date(value);
    if (isNaN(date.getTime()))
      throw new BadRequestException('Invalid startDate');
    if (date < new Date() && date.toDateString() !== new Date().toDateString())
      throw new BadRequestException('startDate must be a future date or today');
    return date;
  })
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @Transform(({ obj, value }) => {
    const start = new Date(obj.startDate);
    const end = new Date(value);
    if (isNaN(end.getTime())) throw new BadRequestException('Invalid endDate');
    if (end < new Date() && end.toDateString() !== new Date().toDateString())
      throw new BadRequestException('endDate must be a future date');
    if (!(end > start))
      throw new BadRequestException('endDate must be after startDate');
    return end;
  })
  endDate: Date;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(1)
  numGuests: number;

  @IsOptional()
  @IsBoolean()
  hasBreakfast: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  @Transform(({ value }) => value?.trim())
  observations?: string;
}
