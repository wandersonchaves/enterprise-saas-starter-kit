import { Injectable, Logger } from '@nestjs/common';
import { IEmailProvider } from '../../interfaces/email.interface';
import { Resend } from 'resend';

@Injectable()
export class ResendAdapter implements IEmailProvider {
  private readonly logger = new Logger(ResendAdapter.name);
  private resend: Resend;

  constructor() {
    // In production, ensure RESEND_API_KEY is available
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');
  }

  async sendEmail(options: {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
  }): Promise<boolean> {
    try {
      const response = await this.resend.emails.send({
        from: process.env.EMAIL_FROM || 'Acme <onboarding@resend.dev>',
        to: options.to,
        subject: options.subject,
        text: options.text || '',
        html: options.html || options.text || '',
      });

      if (response.error) {
        this.logger.error(`Failed to send email: ${response.error.message}`);
        return false;
      }

      this.logger.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error('Unexpected error sending email', error);
      return false;
    }
  }
}
