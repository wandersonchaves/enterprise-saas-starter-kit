import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';
import type { Response } from 'express';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  async chat(
    @Body('messages') messages: any[],
    @Body('organizationId') organizationId: string,
    @Res() res: Response,
  ) {
    const result = await this.aiService.generateChatResponse(messages, organizationId);
    
    // Convert to a stream and pipe to the response
    result.pipeTextStreamToResponse(res);
  }
}
