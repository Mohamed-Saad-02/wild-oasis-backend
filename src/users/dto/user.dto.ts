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
  @Transform(({ value }) => value?.url)
  avatar?: string;
}
