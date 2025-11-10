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

@AuthCompose(UserRole.ADMIN)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('bulk')
  createBulk(@Body() createBookingDto: CreateBookingDto[]) {
    return this.bookingsService.createBulk(createBookingDto);
  }

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

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

  @Get('after-date')
  findAllAfterDate(@Query('date') date: string) {
    return this.bookingsService.findAllAfterBookingDate(date);
  }

  @Get('recent-stays')
  findAllRecentStays(@Query('date') date: string) {
    return this.bookingsService.findAllRecentStays(date);
  }

  @Get('today-activity')
  findAllTodayActivity() {
    return this.bookingsService.findAllTodayActivity();
  }

  @Delete()
  removeAll() {
    return this.bookingsService.removeAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.remove(id);
  }
}
