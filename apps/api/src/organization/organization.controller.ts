import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import type { Role, User, Organization } from '@enterprise/database';
import { ClerkGuard } from '../common/guards/clerk.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { CurrentOrg } from '../common/decorators/org.decorator';

@Controller('organizations')
@UseGuards(ClerkGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get('me')
  async getMyOrganization(@CurrentOrg() org: Organization) {
    return org;
  }

  @Patch('me')
  async updateMyOrganization(
    @CurrentOrg() org: Organization,
    @Body() data: { name?: string, avatarUrl?: string, brandColor?: string }
  ) {
    return this.organizationService.updateOrganization(org.id, data);
  }

  @Get('members')
  async getMembers(@CurrentOrg() org: Organization) {
    return this.organizationService.getMembers(org.id);
  }

  @Post('invites/accept')
  async acceptInvite(
    @Body('token') token: string,
    @CurrentUser() user: User,
  ) {
    return this.organizationService.acceptInvite(token, user.id);
  }

  @Post(':id/invites')
  async inviteMember(
    @Param('id') organizationId: string,
    @Body('email') email: string,
    @Body('role') role: Role,
    @CurrentUser() user: User,
  ) {
    return this.organizationService.inviteMember(organizationId, email, role, user.id);
  }
}
