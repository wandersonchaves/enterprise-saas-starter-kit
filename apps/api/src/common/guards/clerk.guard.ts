import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createClerkClient } from '@clerk/clerk-sdk-node';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClerkGuard implements CanActivate {
  private clerkClient;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.clerkClient = createClerkClient({
      secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Usando o método verifyToken do clerkClient
      const sessionClaims = await this.clerkClient.verifyToken(token);
      
      let user = await this.prisma.client.user.findUnique({
        where: { clerkId: sessionClaims.sub as string },
        include: {
          memberships: {
            include: { organization: true }
          }
        }
      });

      if (!user) {
        // Just-in-Time Provisioning
        const clerkUser = await this.clerkClient.users.getUser(sessionClaims.sub as string);
        const email = clerkUser.emailAddresses[0]?.emailAddress;

        // Tenta encontrar por e-mail se não achou por clerkId (conflito que gerou o erro)
        // ou cria um novo se nada existir.
        user = await this.prisma.client.user.upsert({
          where: { email },
          update: { clerkId: clerkUser.id }, // Vincula o clerkId ao e-mail existente
          create: {
            clerkId: clerkUser.id,
            email: email,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
            avatarUrl: clerkUser.imageUrl,
          },
          include: {
            memberships: {
              include: { organization: true }
            }
          }
        });
      }

      request['user'] = user;
      
      const clerkOrgId = sessionClaims.org_id as string | undefined;
      
      // Se tivermos um org_id no Clerk mas não no nosso banco, sincronizamos a org também
      if (clerkOrgId) {
        let membership = user.memberships.find(m => m.organization.clerkId === clerkOrgId);
        
        if (!membership) {
          const clerkOrg = await this.clerkClient.organizations.getOrganization({ organizationId: clerkOrgId });
          
          const org = await this.prisma.client.organization.upsert({
            where: { clerkId: clerkOrgId },
            update: { name: clerkOrg.name, avatarUrl: clerkOrg.imageUrl },
            create: {
              clerkId: clerkOrgId,
              name: clerkOrg.name,
              slug: clerkOrg.slug || `org-${clerkOrgId.substring(0, 8)}`,
              avatarUrl: clerkOrg.imageUrl,
            }
          });

          await this.prisma.client.member.create({
            data: {
              userId: user.id,
              organizationId: org.id,
              role: 'OWNER', // Por padrão, o primeiro a entrar via Clerk Org é Owner no nosso banco
            }
          });

          request['organization'] = org;
        } else {
          request['organization'] = membership.organization;
        }
      } else {
        request['organization'] = user.memberships[0]?.organization;
      }
      
      return true;
    } catch (error) {
      console.error('Clerk Auth Error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
