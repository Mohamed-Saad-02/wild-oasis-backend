import { CabinDto } from '@/cabins/dto/cabin.dto';
import { BookingStatus } from '../entities/booking.entity';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { UserDto } from '@/users/dto/user.dto';

export class BookingDto {
  @Expose()
  id: number;
  @Expose()
  startDate: Date;
  @Expose()
  endDate: Date;
  @Expose()
  numNights: number;
  @Expose()
  numGuests: number;
  @Expose()
  cabinPrice: number;
  @Expose()
  extrasPrice: number;
  @Expose()
  totalPrice: number;
  @Expose()
  status: BookingStatus;
  @Expose()
  hasBreakfast: boolean;
  @Expose()
  isPaid: boolean;
  @Expose()
  observations: string;
  @Expose()
  @Transform(({ value }) => plainToInstance(CabinDto, value))
  cabin: CabinDto;
  @Expose()
  @Transform(({ value }) => plainToInstance(UserDto, value))
  user: UserDto;
}
