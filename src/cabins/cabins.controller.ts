import { AuthCompose } from '@/common/decorator';
import { UploadFileOptions } from '@/common/utils';
import { UserRole } from '@/users/entities/user.entity';
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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageAllowedTypes } from 'src/common/constants';
import { CabinsService } from './cabins.service';
import { CreateCabinDto } from './dto/create-cabin.dto';
import { UpdateCabinDto } from './dto/update-cabin.dto';

@Controller('cabins')
export class CabinsController {
  constructor(private readonly cabinsService: CabinsService) {}

  @AuthCompose(UserRole.ADMIN)
  @Post()
  @UseInterceptors(
    FileInterceptor(
      'image',
      UploadFileOptions({ allowedFileTypes: ImageAllowedTypes }),
    ),
  )
  create(
    @Body() createCabinDto: CreateCabinDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('Image is required');
    }

    return this.cabinsService.create(createCabinDto, image);
  }

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.cabinsService.findAll({ page, limit });
  }

  @Delete()
  @AuthCompose(UserRole.ADMIN)
  removeAll() {
    return this.cabinsService.removeAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cabinsService.findOne(id);
  }

  @Put(':id')
  @AuthCompose(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor(
      'image',
      UploadFileOptions({ allowedFileTypes: ImageAllowedTypes }),
    ),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCabinDto: UpdateCabinDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.cabinsService.update(id, updateCabinDto, image);
  }

  @Delete(':id')
  @AuthCompose(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cabinsService.remove(id);
  }
}
