import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';
import { EmailService } from './notifications/email.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  @ApiExcludeEndpoint()
  root(@Res() res: Response): void {
    // Redirect root path to API documentation
    res.redirect('/api-docs');
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Fresh Roots API',
        version: '1.0.0',
      },
    };
  }

  @Get('test-email')
  @ApiOperation({ summary: 'Test email configuration (Development only)' })
  @ApiQuery({ name: 'to', required: true, example: 'test@example.com' })
  @ApiResponse({ status: 200, description: 'Test email sent successfully' })
  async testEmail(@Query('to') to: string) {
    try {
      await this.emailService.sendTestEmail(to);
      return {
        success: true,
        message: `Test email sent successfully to ${to}. Check your inbox!`,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send email. Make sure SMTP credentials are configured correctly.',
        error: error.message,
      };
    }
  }
}
