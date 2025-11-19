import { Expose, Transform } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  role: UserRole;
  @Expose()
  @Transform(({ value }) => (value instanceof Object ? value?.url : value))
  avatar?: string;
  @Expose()
  nationality: string;
  @Expose()
  countryFlag: string;
  @Expose()
  nationalID: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
