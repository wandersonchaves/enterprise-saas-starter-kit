import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { Role } from '@enterprise/database';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async createOrganization(
    @Body('name') name: string,
    @Body('slug') slug: string,
    @Request() req: any,
  ) {
    return this.organizationService.createOrganization(req.user.id, name, slug);
  }

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
