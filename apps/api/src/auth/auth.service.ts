import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { NotificationsService } from '../notifications/notifications.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
    private auditLogsService: AuditLogsService,
  ) {}

  async register(email: string, passwordHash: string, name?: string) {
    const existingUser = await this.prisma.client.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(passwordHash, salt);

    const user = await this.prisma.client.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name,
        // When a user registers, they usually need a default organization
        memberships: {
          create: {
            role: 'OWNER',
            organization: {
              create: {
                name: `${name ?? email.split('@')[0]}'s Workspace`,
                slug: `${name?.toLowerCase().replace(/\s+/g, '-') ?? email.split('@')[0]}-${Math.random().toString(36).substring(7)}`,
              },
            },
          },
        },
      },
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    const defaultOrgId = user.memberships[0].organization.id;

    // Background Jobs: Send welcome email and audit log asynchronously
    this.notificationsService.sendWelcomeEmail(user.email, user.name || undefined);
    
    this.auditLogsService.log({
      action: 'USER_REGISTERED',
      entity: 'User',
      entityId: user.id,
      userId: user.id,
      organizationId: defaultOrgId,
      metadata: { email: user.email },
    });

    return this.generateTokens(user.id);
  }

  async login(email: string, passwordHash: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id);
  }

  private async generateTokens(userId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          take: 1, // Get the primary organization
          include: { organization: true },
        },
      },
    });

    const payload = { 
      sub: userId,
      email: user?.email,
      role: user?.memberships[0]?.role || 'VIEWER',
      organizationId: user?.memberships[0]?.organizationId || null,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
