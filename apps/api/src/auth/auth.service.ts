import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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
    const payload = { sub: userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
