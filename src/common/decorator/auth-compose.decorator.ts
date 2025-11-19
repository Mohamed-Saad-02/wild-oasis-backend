import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../guards';
import { Roles } from './roles.decorator';
import { UserRole } from '@/users/entities/user.entity';

export const AuthCompose = (...roles: UserRole[]) => {
  if (roles.length === 0) {
    return applyDecorators(UseGuards(JwtAuthGuard));
  }
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(...roles));
};
