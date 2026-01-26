import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { PaymentInitiateDto } from './dto/payment-initiate.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private paymentsService: PaymentsService) {}

  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate Juice payment via MIPS' })
  async initiatePayment(@Body() dto: PaymentInitiateDto) {
    return this.paymentsService.initiateJuicePayment(dto);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'MIPS payment webhook (called by payment gateway)' })
  async handleWebhook(
    @Body() payload: any,
    @Headers('x-webhook-signature') signature: string,
  ) {
    await this.paymentsService.handleWebhook(payload, signature);
    return { received: true };
  }

  @Get('status/:transactionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment status by transaction ID' })
  async getPaymentStatus(@Param('transactionId') transactionId: string) {
    return this.paymentsService.getPaymentStatus(transactionId);
  }
}
