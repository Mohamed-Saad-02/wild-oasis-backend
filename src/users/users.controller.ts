import { ImageAllowedTypes } from '@/common/constants';
import { AuthCompose, CurrentUser } from '@/common/decorator';
import { UploadFileOptions } from '@/common/utils';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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

  @AuthCompose(UserRole.ADMIN)
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.usersService.findAll({ page, limit });
  }

  @Get('email/:email')
  findOneByEmail(@Param('email') email: string) {
    if (!email) throw new BadRequestException('Email is required');

    return this.usersService.findOneByEmail(email);
  }

  @AuthCompose()
  @Get('me')
  me(@Req() req: Request & { user: UserEntity }) {
    return plainToInstance(UserDto, req.user, {
      excludeExtraneousValues: true,
    });
  }

  @AuthCompose()
  @Put('me')
  @UseInterceptors(
    FileInterceptor(
      'avatar',
      UploadFileOptions({ allowedFileTypes: ImageAllowedTypes }),
    ),
  )
  updateMe(
    @Body() updateUserDto: UpdateUserMeDto,
    @CurrentUser() user: UserEntity,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return this.usersService.updateMe(user.id, updateUserDto, avatar);
  }

  @AuthCompose()
  @Delete('me')
  deleteMe(@CurrentUser() user: UserEntity) {
    return this.usersService.deleteUser(user);
  }

  @AuthCompose(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @AuthCompose(UserRole.ADMIN)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserEntity,
  ) {
    return this.usersService.remove(id, user);
  }
}
