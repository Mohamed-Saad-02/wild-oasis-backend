import { CabinsModule } from '@/cabins/cabins.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingEntity } from './entities/booking.entity';
import { SettingsModule } from '@/settings/settings.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEntity]),
    UsersModule,
    CabinsModule,
    SettingsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
