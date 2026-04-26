import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@enterprise/database';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    // No multi-tenant apps, a role do usuário depende do organizationId na requisição.
    // Por enquanto, assumimos o papel do contexto do usuário se disponível ou deixamos passar se não houver roles exigidas.
    return requiredRoles.some((role) => user.role === role);
  }
}
