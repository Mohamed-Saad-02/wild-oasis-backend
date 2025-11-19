import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { BookingEntity } from './bookings/entities/booking.entity';
import { CabinsModule } from './cabins/cabins.module';
import { CabinEntity } from './cabins/entities/cabin.entity';
import { GlobalModule } from './global.module';
import { SettingEntity } from './settings/entities/setting.entity';
import { SettingsModule } from './settings/settings.module';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      // host: process.env.DATABASE_HOST,
      // port: parseInt(process.env.DB_PORT ?? '5432'),
      // username: process.env.DB_USER ?? 'postgres',
      // password: process.env.DB_PASS ?? 'postgres',
      // database: process.env.DB_NAME ?? 'wild-oasis',
      autoLoadEntities: true, // automatically loads entities from modules
      synchronize: process.env.NODE_ENV !== 'production', // auto-sync schema (disable in production)
      entities: [SettingEntity, UserEntity, CabinEntity, BookingEntity],
      ssl: {
        rejectUnauthorized: false, // for Remote Database
      },
    }),

    GlobalModule,

    SettingsModule,

    CabinsModule,

    BookingsModule,

    UsersModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
