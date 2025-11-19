import { AuthCompose, CurrentUser } from '@/common/decorator';
import { UserEntity, UserRole } from '@/users/entities/user.entity';
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

  @AuthCompose(UserRole.GUEST)
  @Post('me')
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.bookingsService.create(createBookingDto, user.id);
  }

  @AuthCompose(UserRole.GUEST)
  @Get('me')
  getMyBookings(
    @CurrentUser() user: UserEntity,
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
      userId: user.id,
    });
  }

  @AuthCompose(UserRole.GUEST)
  @Get('me/:id')
  getMyBooking(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserEntity,
  ) {
    return this.bookingsService.getMyBooking(id, user);
  }

  @AuthCompose(UserRole.GUEST)
  @Put('me/:id')
  updateMyBooking(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.bookingsService.update(id, updateBookingDto, user);
  }

  @AuthCompose(UserRole.GUEST)
  @Delete('me/:id')
  removeMyBooking(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserEntity,
  ) {
    return this.bookingsService.remove(id, user);
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

  @AuthCompose(UserRole.GUEST)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Get(':id')
  @AuthCompose(UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @AuthCompose(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.remove(id);
  }
}
