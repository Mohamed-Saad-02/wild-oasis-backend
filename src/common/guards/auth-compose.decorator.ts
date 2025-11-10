import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { RoleGuard, Roles } from './role.guard';
import { UserRole } from '@/users/entities/user.entity';

/**
 * AuthCompose decorator that combines AuthGuard and RoleGuard
 * @param roles Optional array of roles. If not provided, allows access to all authenticated users
 * @returns Decorator that applies both guards
 */
export function AuthCompose(...roles: UserRole[]) {
  if (roles.length === 0) {
    // If no roles specified, only apply AuthGuard
    return applyDecorators(UseGuards(AuthGuard));
  }

  // If roles specified, apply both guards
  return applyDecorators(UseGuards(AuthGuard, RoleGuard), Roles(...roles));
}

