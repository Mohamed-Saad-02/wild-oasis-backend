import { ConstantsService } from '@/common/constants';
import { UploadCloudFileService } from '@/common/services';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserMeDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity, UserProvider, UserRole } from './entities/user.entity';
import { log } from 'util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly uploadFileService: UploadCloudFileService,
    private readonly constantsService: ConstantsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.isExists({ email: createUserDto.email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    if (createUserDto.password) {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashedPassword;
    }

    const user = this.userRepository.create({
      ...createUserDto,
      avatar: createUserDto.avatar ? { url: createUserDto.avatar } : undefined,
    });

    await this.userRepository.save(user);
    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findAll({ page, limit }: { page: number; limit: number }) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    const totalPages = Math.ceil(total / limit);
    return {
      metadata: { page, limit, total, totalPages },
      data: plainToInstance(UserDto, users, {
        excludeExtraneousValues: true,
      }),
    };
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
      const existingUser = await this.isExists({ email: updateUserDto.email });
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
    user.nationality = updateUserDto.nationality ?? user.nationality;
    user.countryFlag = updateUserDto.countryFlag ?? user.countryFlag;
    user.nationalID = updateUserDto.nationalID ?? user.nationalID;

    await this.userRepository.save(user);
    return { message: 'User updated successfully' };
  }

  async remove(id: number, user: UserEntity) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You are not authorized to delete this user',
      );
    }
    const userToDelete = await this.findOneById(id);
    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }
    await this.deleteUser(userToDelete);
    return { message: 'User deleted successfully' };
  }

  async isExists(
    filter:
      | FindOptionsWhere<UserEntity>
      | FindOptionsWhere<UserEntity>[]
      | undefined,
  ) {
    return await this.userRepository.exists({ where: filter });
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async findOneById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async deleteUser(user: UserEntity) {
    const promises: Promise<void | DeleteResult>[] = [];
    if (user.avatar) {
      promises.push(this.uploadFileService.deleteFile(user.avatar.public_id));
    }
    promises.push(this.userRepository.delete(user.id));
    await Promise.all(promises);
    return { message: 'User deleted successfully' };
  }
}
