import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto extends PickType(CreateUserDto, ['email'] as const) {
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
