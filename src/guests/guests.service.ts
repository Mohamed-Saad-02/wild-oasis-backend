import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Repository } from 'typeorm';
import { GuestEntity } from './entities/guest.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(GuestEntity)
    private readonly guestRepository: Repository<GuestEntity>,
  ) {}

  async create(createGuestDto: CreateGuestDto) {
    const guest = this.guestRepository.create(createGuestDto);
    await this.guestRepository.save(guest);
    return {
      message: 'Guest created successfully',
    };
  }

  async createBulk(createGuestDto: CreateGuestDto[]) {
    const guests = this.guestRepository.create(createGuestDto);
    await this.guestRepository.save(guests);
    return {
      message: 'Guests created successfully',
    };
  }

  async findAll() {
    const guests = await this.guestRepository.find();
    return guests;
  }

  async findOne(id: number) {
    const guest = await this.guestRepository.findOne({ where: { id } });
    if (!guest) {
      throw new NotFoundException('Guest not found');
    }
    return guest;
  }

  async update(id: number, updateGuestDto: UpdateGuestDto) {
    const guest = await this.guestRepository.findOne({ where: { id } });
    if (!guest) {
      throw new NotFoundException('Guest not found');
    }
    await this.guestRepository.update(id, updateGuestDto);
    return {
      message: 'Guest updated successfully',
    };
  }

  async remove(id: number) {
    const guest = await this.guestRepository.findOne({ where: { id } });
    if (!guest) {
      throw new NotFoundException('Guest not found');
    }
    await this.guestRepository.delete(id);
    return {
      message: 'Guest deleted successfully',
    };
  }

  async isExists(id: number) {
    return await this.guestRepository.exists({ where: { id } });
  }

  async removeAll() {
    await this.guestRepository.deleteAll();
    return {
      message: 'All guests deleted successfully',
    };
  }
}
