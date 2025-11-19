import { AuthCompose } from '@/common/decorator';
import { UserRole } from '@/users/entities/user.entity';
import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @AuthCompose(UserRole.ADMIN)
  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @Get()
  findSetting() {
    return this.settingsService.findSetting();
  }

  @AuthCompose(UserRole.ADMIN)
  @Put()
  update(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(updateSettingDto);
  }
}
