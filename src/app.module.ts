import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingsModule } from './bookings/bookings.module';
import { CabinsModule } from './cabins/cabins.module';
import { GuestsModule } from './guests/guests.module';
import { SettingsModule } from './settings/settings.module';
import { SettingEntity } from './settings/entities/setting.entity';
import { GuestEntity } from './guests/entities/guest.entity';
import { CabinEntity } from './cabins/entities/cabin.entity';
import { BookingEntity } from './bookings/entities/booking.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true, // automatically loads entities from modules
      synchronize: process.env.NODE_ENV !== 'production', // auto-sync schema (disable in production)
      entities: [SettingEntity, GuestEntity, CabinEntity, BookingEntity],
      ssl: {
        rejectUnauthorized: false, // for Remote Database
      },
    }),

    GlobalModule,

    SettingsModule,

    CabinsModule,

    BookingsModule,

    GuestsModule,

    UsersModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
