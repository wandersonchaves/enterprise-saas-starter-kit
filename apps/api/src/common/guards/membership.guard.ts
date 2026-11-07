import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GetMembershipService } from '../../organization/get-membership.service';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '@enterprise/database';

@Injectable()
export class MembershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private getMembershipService: GetMembershipService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const orgSlug = request.params.orgSlug || request.query.orgSlug;

    if (!user) {
      return false;
    }

    // Deny by default: a route behind this guard must name its organization.
    if (!orgSlug) {
      throw new ForbiddenException('Organization context is required');
    }

    const membership = await this.getMembershipService.execute(
      user.id,
      orgSlug,
      requiredRoles,
    );

    request['membership'] = membership;
    request['organization'] = membership.organization;

    return true;
  }
}
