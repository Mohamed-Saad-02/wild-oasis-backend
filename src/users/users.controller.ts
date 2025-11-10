import { ImageAllowedTypes } from '@/common/constants';
import { AuthCompose } from '@/common/guards';
import { UploadFileOptions } from '@/common/utils';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserMeDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity, UserRole } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @AuthCompose(UserRole.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @AuthCompose(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @AuthCompose()
  @Get('me')
  me(@Req() req: Request & { user: UserEntity }) {
    return plainToInstance(UserDto, req.user, {
      excludeExtraneousValues: true,
    });
  }

  @Put('me')
  @AuthCompose()
  @UseInterceptors(
    FileInterceptor(
      'avatar',
      UploadFileOptions({ allowedFileTypes: ImageAllowedTypes }),
    ),
  )
  updateMe(
    @Req() req: Request & { user: UserEntity },
    @Body() updateUserDto: UpdateUserMeDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return this.usersService.updateMe(req.user.id, updateUserDto, avatar);
  }

  @AuthCompose(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @AuthCompose(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
