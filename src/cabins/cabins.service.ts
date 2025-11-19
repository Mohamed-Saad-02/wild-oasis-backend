import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { UploadCloudFileService } from 'src/common/services';
import { Repository } from 'typeorm';
import { CreateCabinDto } from './dto/create-cabin.dto';
import { UpdateCabinDto } from './dto/update-cabin.dto';
import { CabinEntity } from './entities/cabin.entity';
import { ConstantsService } from '@/common/constants';
import { CabinDto } from './dto/cabin.dto';

@Injectable()
export class CabinsService {
  constructor(
    @InjectRepository(CabinEntity)
    private readonly cabinRepository: Repository<CabinEntity>,
    private readonly uploadFileService: UploadCloudFileService,
    private readonly constantsService: ConstantsService,
  ) {}

  async create(createCabinDto: CreateCabinDto, image: Express.Multer.File) {
    const uploadFile = await this.uploadFileService.uploadFile(image, {
      folder: this.constantsService.CLOUDINARY_FOLDER_CABIN,
    });

    const createCabin: Partial<CabinEntity> = {
      ...createCabinDto,
      image: {
        url: uploadFile.secure_url,
        public_id: uploadFile.public_id,
      },
    };

    const cabin = this.cabinRepository.create(createCabin);
    await this.cabinRepository.save(cabin);
    return {
      message: 'Cabin created successfully',
    };
  }

  async findAll({ page, limit }: { page: number; limit: number }) {
    const [cabins, total] = await this.cabinRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      metadata: { page, limit, total, totalPages },
      data: plainToInstance(CabinDto, cabins),
    };
  }

  async findOne(id: number) {
    const cabin = await this.cabinRepository.findOne({ where: { id } });
    if (!cabin) throw new NotFoundException('Cabin not found');
    return plainToInstance(CabinDto, cabin);
  }

  async update(
    id: number,
    updateCabinDto: UpdateCabinDto,
    image?: Express.Multer.File,
  ) {
    const cabin = await this.cabinRepository.findOne({ where: { id } });
    if (!cabin) {
      throw new NotFoundException('Cabin not found');
    }

    if (image) {
      const uploadFile = await this.uploadFileService.uploadFile(image, {
        folder: this.constantsService.CLOUDINARY_FOLDER_CABIN,
        public_id: cabin.image.public_id,
      });
      cabin.image = {
        url: uploadFile.secure_url,
        public_id: uploadFile.public_id,
      };
    }

    cabin.name = updateCabinDto.name ?? cabin.name;
    cabin.maxCapacity = updateCabinDto.maxCapacity ?? cabin.maxCapacity;
    cabin.regularPrice = updateCabinDto.regularPrice ?? cabin.regularPrice;
    cabin.discount = updateCabinDto.discount ?? cabin.discount;
    cabin.description = updateCabinDto.description ?? cabin.description;

    await this.cabinRepository.save(cabin);

    return {
      message: 'Cabin updated successfully',
    };
  }

  async remove(id: number) {
    const cabin = await this.cabinRepository.findOne({ where: { id } });
    if (!cabin) throw new NotFoundException('Cabin not found');

    await Promise.all([
      this.uploadFileService.deleteFile(cabin.image.public_id),
      this.cabinRepository.delete(id),
    ]);

    return {
      message: 'Cabin deleted successfully',
    };
  }

  async isExists(id: number) {
    return await this.cabinRepository.exists({ where: { id } });
  }

  async removeAll() {
    const message = 'All cabins deleted successfully';

    const cabins = await this.cabinRepository.find({ select: ['image'] });
    if (!cabins?.length) return { message };

    await Promise.all(
      cabins.map((cabin) =>
        this.uploadFileService.deleteFile(cabin.image.public_id),
      ),
    );

    await this.cabinRepository.deleteAll();
    return {
      message,
    };
  }
}
