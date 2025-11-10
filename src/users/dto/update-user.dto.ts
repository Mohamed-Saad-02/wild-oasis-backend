import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserMeDto extends PartialType(
  OmitType(CreateUserDto, ['role'] as const),
) {}
