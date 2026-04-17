import { Controller, Post, Body, Headers, Req, BadRequestException } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { BillingService } from './billing.service';
import type { Request } from 'express';

@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Post('checkout')
  async createCheckout(@Body('organizationId') organizationId: string, @Body('plan') plan: string) {
    return this.billingService.createCheckoutSession(organizationId, plan);
  }

  @Post('webhook')
  async webhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    
    const body = req.rawBody;
    if (!body) {
      throw new BadRequestException('Missing raw body');
    }

    await this.billingService.handleWebhook(signature, body);
    return { received: true };
  }
}
