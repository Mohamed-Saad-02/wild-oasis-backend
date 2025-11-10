import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingEntity } from './entities/setting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>,
  ) {}

  async create(createSettingDto: CreateSettingDto) {
    const setting = this.settingRepository.create(createSettingDto);
    await this.settingRepository.save(setting);
    return {
      message: 'Setting created successfully',
    };
  }

  async findSetting() {
    const setting = await this.settingRepository.findOne({ where: { id: 1 } });
    if (!setting) {
      throw new NotFoundException('Setting not found');
    }
    return setting;
  }

  async update(updateSettingDto: UpdateSettingDto) {
    const setting = await this.settingRepository.findOne({ where: { id: 1 } });
    if (!setting) {
      throw new NotFoundException('Setting not found');
    }
    await this.settingRepository.update(setting.id, updateSettingDto);
    return {
      message: 'Setting updated successfully',
    };
  }
}
