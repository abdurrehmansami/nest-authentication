import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
import { UserRole } from './auth/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!roles) {
      return true; // If no roles are defined, allow access
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return true;
    }

    return user && roles.includes(user.role);
  }
}
