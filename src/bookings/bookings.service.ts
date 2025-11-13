import { CabinsService } from '@/cabins/cabins.service';
import { GuestsService } from '@/guests/guests.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  MoreThanOrEqual,
  Not,
  Or,
  Repository,
} from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingEntity, BookingStatus } from './entities/booking.entity';

export interface FindAllBookingsDto {
  page: number;
  limit: number;
  status?: BookingStatus;
  sortOrder?: 'asc' | 'desc';
  sortBy?: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'totalPrice';
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    private readonly cabinsService: CabinsService,
    private readonly guestsService: GuestsService,
  ) {}

  async createBulk(createBookingDto: CreateBookingDto[]) {
    const bookings = createBookingDto.map((dto) => {
      return this.bookingRepository.create({
        ...dto,
        cabin: { id: dto.cabinId },
        guest: { id: dto.guestId },
      });
    });

    await this.bookingRepository.save(bookings);

    return {
      message: 'Bookings created successfully',
    };
  }

  async create(createBookingDto: CreateBookingDto) {
    const { cabinId, guestId, ...rest } = createBookingDto;

    const cabin = await this.cabinsService.isExists(cabinId);
    if (!cabin) throw new BadRequestException('Cabin does not exist');
    const guest = await this.guestsService.isExists(guestId);
    if (!guest) throw new BadRequestException('Guest does not exist');

    const booking = this.bookingRepository.create({
      ...rest,
      cabin: { id: cabinId },
      guest: { id: guestId },
    });
    await this.bookingRepository.save(booking);
    return {
      message: 'Booking created successfully',
    };
  }

  async findAll({
    page = 1,
    limit = 10,
    status,
    sortOrder,
    sortBy,
  }: FindAllBookingsDto) {
    const where: FindOptionsWhere<BookingEntity> = {};

    if (status) {
      where.status = status;
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
          name: true,
        },
        guest: {
          fullName: true,
          email: true,
        },
      },
      relations: {
        cabin: true,
        guest: true,
      },
    });

    const totalPages = Math.ceil(total / limit);

    return { metadata: { page, limit, total, totalPages }, data: bookings };
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: {
        cabin: true,
        guest: true,
      },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const transformedCabin = this.cabinsService.transformCabin(booking.cabin);

    return { ...booking, cabin: transformedCabin };
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    await this.bookingRepository.update(id, updateBookingDto);
    return {
      message: 'Booking updated successfully',
    };
  }

  async remove(id: number) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    await this.bookingRepository.delete(id);
    return {
      message: 'Booking deleted successfully',
    };
  }

  async removeAll() {
    await this.bookingRepository.deleteAll();
    return {
      message: 'All bookings deleted successfully',
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
      .leftJoinAndSelect('booking.guest', 'guest')
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
}
