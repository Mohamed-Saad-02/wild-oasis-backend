import { ConstantsService } from '@/common/constants';
import { UploadCloudFileService } from '@/common/services';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserMeDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly uploadFileService: UploadCloudFileService,
    private readonly constantsService: ConstantsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.isExists(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    return {
      message: 'User created successfully',
    };
  }

  async findAll() {
    const users = await this.userRepository.find({
      select: {
        password: false,
      },
    });
    return plainToInstance(UserDto, users, {
      excludeExtraneousValues: true,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async updateMe(
    id: number,
    updateUserDto: UpdateUserMeDto,
    avatar?: Express.Multer.File,
  ) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Upload avatar
    if (avatar) {
      const uploadFile = await this.uploadFileService.uploadFile(avatar, {
        folder: this.constantsService.CLOUDINARY_FOLDER_AVATAR,
        ...(user.avatar ? { public_id: user.avatar.public_id } : {}),
      });
      user.avatar = {
        url: uploadFile.secure_url,
        public_id: uploadFile.public_id,
      };
    }

    // Update email
    if (updateUserDto.email) {
      const existingUser = await this.isExists(updateUserDto.email);
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
      user.email = updateUserDto.email;
    }

    // Update password
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      user.password = hashedPassword;
    }

    user.name = updateUserDto.name ?? user.name;
    await this.userRepository.save(user);
    return { message: 'User updated successfully' };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async isExists(email: string) {
    return await this.userRepository.exists({ where: { email } });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findOneById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }
}
