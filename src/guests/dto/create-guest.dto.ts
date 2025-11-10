import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateGuestDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nationalID: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.charAt(0).toUpperCase() + value.slice(1))
  nationality: string;

  @IsUrl()
  @IsNotEmpty()
  countryFlag: string;
}
