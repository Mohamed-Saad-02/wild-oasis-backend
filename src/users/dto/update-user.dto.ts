import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserMeDto extends PartialType(
  OmitType(CreateUserDto, ['role'] as const),
) {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.charAt(0).toUpperCase() + value.slice(1))
  nationality?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  countryFlag?: string;

  @IsString()
  @IsOptional()
  nationalID?: string;
}
