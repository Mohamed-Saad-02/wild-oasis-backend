import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UserProvider } from '@/users/entities/user.entity';
import { OmitType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class RegisterDto extends OmitType(CreateUserDto, ['role'] as const) {
  @IsString()
  @IsOptional()
  nationalID?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.charAt(0).toUpperCase() + value.slice(1))
  nationality?: string;

  @IsUrl()
  @IsOptional()
  countryFlag?: string;

  @IsEnum(UserProvider)
  @IsOptional()
  provider?: UserProvider;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;
}
