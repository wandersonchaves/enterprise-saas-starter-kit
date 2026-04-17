import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { Role } from '@enterprise/database';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get(':id')
  async getOrganization(@Param('id') id: string) {
    return this.organizationService.getOrganization(id);
  }

  @Post(':id/invites')
  async inviteMember(
    @Param('id') organizationId: string,
    @Body('email') email: string,
    @Body('role') role: Role,
    @Request() req: any,
  ) {
    const authorId = req.user.id;
    return this.organizationService.inviteMember(organizationId, email, role, authorId);
  }
}
