import { Injectable, ForbiddenException, NotFoundException, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@enterprise/database';
import * as crypto from 'crypto';
import { EMAIL_PROVIDER } from '../common/interfaces/email.interface';
import type { IEmailProvider } from '../common/interfaces/email.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class OrganizationService {
  constructor(
    private prisma: PrismaService,
    @Inject(EMAIL_PROVIDER) private emailProvider: IEmailProvider,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getOrganization(id: string) {
    const cachedOrg = await this.cacheManager.get(`org:${id}`);
    if (cachedOrg) return cachedOrg;

    const org = await this.prisma.client.organization.findUnique({
      where: { id },
    });

    if (!org) throw new NotFoundException('Organization not found');

    await this.cacheManager.set(`org:${id}`, org);
    return org;
  }

  async inviteMember(organizationId: string, email: string, role: Role, authorId: string) {
    // Check if author has permission to invite
    const authorMember = await this.prisma.client.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: authorId,
        },
      },
    });

    if (!authorMember || !['OWNER', 'ADMIN'].includes(authorMember.role)) {
      throw new ForbiddenException('Only owners and admins can invite members');
    }

    // Check if user is already a member
    const existingMember = await this.prisma.client.member.findFirst({
      where: {
        organizationId,
        user: { email },
      },
    });

    if (existingMember) {
      throw new ForbiddenException('User is already a member of this organization');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    const invite = await this.prisma.client.invite.create({
      data: {
        email,
        role,
        token,
        expiresAt,
        organizationId,
        authorId,
      },
    });

    // Send an email here with the invite link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const inviteLink = `${frontendUrl}/invite?token=${token}`;

    await this.emailProvider.sendEmail({
      to: email,
      subject: 'You have been invited to join an organization',
      html: `<p>You have been invited to join. Click <a href="${inviteLink}">here</a> to accept.</p>`,
    });

    return invite;
  }
}
