import { AuthCompose } from '@/common/guards';
import { UserRole } from '@/users/entities/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus } from './entities/booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @AuthCompose(UserRole.ADMIN)
  @Post('bulk')
  createBulk(@Body() createBookingDto: CreateBookingDto[]) {
    return this.bookingsService.createBulk(createBookingDto);
  }

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @AuthCompose(UserRole.ADMIN)
  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status')
    status?: BookingStatus,
    @Query('sortBy')
    sortBy?: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'totalPrice',
    @Query('sortOrder')
    sortOrder?: 'asc' | 'desc',
  ) {
    return this.bookingsService.findAll({
      page,
      limit,
      status,
      sortOrder,
      sortBy,
    });
  }

  @AuthCompose(UserRole.ADMIN)
  @Get('after-date')
  findAllAfterDate(@Query('date') date: string) {
    return this.bookingsService.findAllAfterBookingDate(date);
  }

  @AuthCompose(UserRole.ADMIN)
  @Get('recent-stays')
  findAllRecentStays(@Query('date') date: string) {
    return this.bookingsService.findAllRecentStays(date);
  }

  @AuthCompose(UserRole.ADMIN)
  @Get('today-activity')
  findAllTodayActivity() {
    return this.bookingsService.findAllTodayActivity();
  }

  @Get('booked-dates/:cabinId')
  getBookedDatesByCabinId(@Param('cabinId', ParseIntPipe) cabinId: number) {
    return this.bookingsService.getBookedDatesByCabinId(cabinId);
  }

  @AuthCompose(UserRole.ADMIN)
  @Delete()
  removeAll() {
    return this.bookingsService.removeAll();
  }

  @Get(':id')
  @AuthCompose(UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @AuthCompose(UserRole.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @AuthCompose(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.remove(id);
  }
}
