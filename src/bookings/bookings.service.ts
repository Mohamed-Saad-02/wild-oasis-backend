import { CabinsService } from '@/cabins/cabins.service';
import { CabinDto } from '@/cabins/dto/cabin.dto';
import { SettingsService } from '@/settings/settings.service';
import { UsersService } from '@/users/users.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  LessThan,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { BookingDto } from './dto/booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingEntity, BookingStatus } from './entities/booking.entity';
import { UserEntity, UserRole } from '@/users/entities/user.entity';

export interface FindAllBookingsDto {
  page: number;
  limit: number;
  status?: BookingStatus;
  sortOrder?: 'asc' | 'desc';
  sortBy?: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'totalPrice';
  userId?: number;
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    private readonly cabinsService: CabinsService,
    private readonly usersService: UsersService,
    private readonly settingsService: SettingsService,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const { cabinId, ...rest } = createBookingDto;

    const cabin = await this.cabinsService.findOne(cabinId);
    if (!cabin) throw new BadRequestException('Cabin does not exist');

    const user = await this.usersService.isExists({ id: userId });
    if (!user) throw new BadRequestException('User does not exist');

    // calculate numNights
    const numNights = Math.ceil(
      (rest.endDate.getTime() - rest.startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const settings = await this.settingsService.findSetting();

    if (numNights < settings.minBookingLength) {
      throw new BadRequestException('Booking length is less than minimum');
    }
    if (numNights > settings.maxBookingLength) {
      throw new BadRequestException('Booking length is greater than maximum');
    }
    if (rest.numGuests > settings.maxGuestsPerBooking) {
      throw new BadRequestException('Number of guests exceeds maximum allowed');
    }

    // Check if cabin is already booked for the selected dates
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        cabin: { id: cabinId },
        status: Not(BookingStatus.CHECKED_IN),
        startDate: LessThan(rest.endDate),
        endDate: MoreThan(rest.startDate),
      },
    });

    if (existingBooking) {
      throw new BadRequestException(
        'Cabin is already booked for the selected dates',
      );
    }

    // calculate prices
    const breakfastPrice = rest.hasBreakfast ? settings.breakfastPrice : 0;
    const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
    const extrasPrice = breakfastPrice * rest.numGuests * numNights;

    const booking = this.bookingRepository.create({
      ...rest,
      cabinPrice,
      extrasPrice,
      totalPrice: cabinPrice + extrasPrice,
      numNights,
      cabin: { id: cabinId },
      user: { id: userId },
    });

    await this.bookingRepository.save(booking);

    return { message: 'Booking created successfully' };
  }

  async findAll({
    page = 1,
    limit = 10,
    status,
    sortOrder,
    sortBy,
    userId,
  }: FindAllBookingsDto) {
    const where: FindOptionsWhere<BookingEntity> = {};

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.user = { id: userId };
    }

    const order: FindOptionsOrder<BookingEntity> = {};

    if (sortBy) {
      order[sortBy] = sortOrder;
    }

    const [bookings, total] = await this.bookingRepository.findAndCount({
      where,
      order,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        startDate: true,
        endDate: true,
        numNights: true,
        numGuests: true,
        status: true,
        totalPrice: true,
        createdAt: true,
        updatedAt: true,
        cabin: {
          id: true,
          name: true,
          discount: true,
          image: true,
        },
        user: {
          id: true,
          // fullName: true,
          // email: true,
        },
      },
      relations: {
        cabin: true,
        user: true,
      },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      metadata: { page, limit, total, totalPages },
      data: plainToInstance(BookingDto, bookings),
    };
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: {
        cabin: true,
        user: true,
      },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return { ...booking, cabin: plainToInstance(CabinDto, booking.cabin) };
  }

  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
    user?: UserEntity | null,
  ) {
    const where: FindOptionsWhere<BookingEntity> = { id };
    if (user && user.role === UserRole.GUEST) {
      where.user = { id: user.id };
    }

    const booking = await this.bookingRepository.findOne({
      where,
      relations: { user: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    await this.bookingRepository.update(id, updateBookingDto);
    return {
      message: 'Booking updated successfully',
    };
  }

  async remove(id: number, user?: UserEntity | null) {
    const where: FindOptionsWhere<BookingEntity> = { id };
    if (user && user.role === UserRole.GUEST) {
      where.user = { id: user.id };
    }

    const booking = await this.bookingRepository.findOne({
      where,
      relations: { user: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (user && user.role !== UserRole.ADMIN && booking.user.id !== user.id) {
      throw new ForbiddenException(
        'You are not authorized to delete this booking',
      );
    }
    await this.bookingRepository.delete(id);
    return {
      message: 'Booking deleted successfully',
    };
  }

  // find all bookings that are created after the booking date to today
  async findAllAfterBookingDate(date: string) {
    if (!date) {
      throw new BadRequestException('Date is required');
    }

    const today = new Date();
    today.setUTCHours(23, 59, 59, 999); // set the time to the end of the day

    // get all bookings after the booking date to today
    const bookings = await this.bookingRepository.find({
      where: {
        createdAt: Between(new Date(date), today),
      },
    });
    return bookings;
  }

  // find all bookings that are checked in or checked out and have a start date or end date today
  async findAllRecentStays(date: string) {
    if (!date) {
      throw new BadRequestException('Date is required');
    }

    const today = new Date();
    today.setUTCHours(23, 59, 59, 999); // set the time to the end of the day

    const bookings = await this.bookingRepository.find({
      where: {
        startDate: Between(new Date(date), today),
        status: In([BookingStatus.CHECKED_IN, BookingStatus.CHECKED_OUT]),
      },
    });
    return bookings;
  }

  // find all bookings that are unconfirmed or checked in and have a start date or end date today
  async findAllTodayActivity() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // the next day (exclusive)

    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .where(
        `(booking.status = :unconfirmed AND booking.startDate >= :today AND booking.startDate < :tomorrow)`,
      )
      .orWhere(
        `(booking.status = :checkedIn AND booking.endDate >= :today AND booking.endDate < :tomorrow)`,
      )
      .orderBy('booking.createdAt', 'ASC')
      .setParameters({
        unconfirmed: BookingStatus.UNCONFIRMED,
        checkedIn: BookingStatus.CHECKED_IN,
        today,
        tomorrow,
      });

    const bookings = await query.getMany();
    return bookings;
  }

  // get all bookings for a cabin that are checked in or have a start date today
  async getBookedDatesByCabinId(cabinId: number) {
    let today: Date | string = new Date();
    if (today instanceof Date) {
      today.setHours(0, 0, 0, 0);
      today = today.toISOString();
    }

    // Check if cabin exists
    const cabin = await this.cabinsService.isExists(cabinId);
    if (!cabin) throw new NotFoundException('Cabin not found');

    // Get all bookings for the cabin that:
    // (startDate >= today) OR (status = CHECKED_IN)
    const bookings = await this.bookingRepository.find({
      where: [
        {
          cabin: { id: cabinId },
          startDate: MoreThanOrEqual(new Date(today)),
        },
        {
          cabin: { id: cabinId },
          status: BookingStatus.CHECKED_IN,
        },
      ],
      select: {
        startDate: true,
        endDate: true,
      },
    });
    return bookings;
  }

  async getMyBooking(id: number, user: UserEntity) {
    const booking = await this.bookingRepository.findOne({
      where: { id, user: { id: user.id } },
      relations: {
        cabin: true,
        user: true,
      },
      select: {
        id: true,
        observations: true,
        numGuests: true,
        cabin: {
          id: true,
          maxCapacity: true,
        },
      },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return plainToInstance(BookingDto, booking);
  }
}
