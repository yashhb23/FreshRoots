import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { PostHogService } from '../analytics/posthog.service';
import { PaymentInitiateDto } from './dto/payment-initiate.dto';

export interface PaymentResponse {
  success: boolean;
  transaction_id?: string;
  paymentUrl?: string;
  qrCode?: string;
  message?: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private mipsClient: AxiosInstance;
  private mipsEnabled: boolean;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private posthog: PostHogService,
  ) {
    const mipsApiKey = this.configService.get<string>('MIPS_API_KEY');
    const mipsMerchantId = this.configService.get<string>('MIPS_MERCHANT_ID');

    if (mipsApiKey && mipsMerchantId && mipsApiKey !== 'your-mips-api-key') {
      const mipsApiUrl = this.configService.get<string>('MIPS_API_URL') || 'https://api.mips.mu/v1';
      this.mipsClient = axios.create({
        baseURL: mipsApiUrl,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': mipsApiKey,
          'X-Merchant-ID': mipsMerchantId,
        },
        timeout: 30000,
      });
      this.mipsEnabled = true;
      this.logger.log('✅ MIPS payment gateway initialized');
    } else {
      this.mipsEnabled = false;
      this.logger.warn('⚠️  MIPS credentials not configured. Payment integration disabled.');
    }
  }

  /**
   * Initiate Juice payment via MIPS
   * Note: This is a placeholder implementation. Actual MIPS API endpoints and payloads
   * will depend on the specific integration agreement with MIPS/Paywise.
   */
  async initiateJuicePayment(dto: PaymentInitiateDto): Promise<PaymentResponse> {
    if (!this.mipsEnabled) {
      // Simulate payment for development
      this.logger.warn('[DEV MODE] MIPS not configured. Simulating payment approval.');
      
      // Create a simulated transaction record
      const simulatedTxId = `SIM-${Date.now()}`;
      await this.prisma.payment_transactions.create({
        data: {
          order_id: dto.orderId.toString(),
          transaction_id: simulatedTxId,
          amount: dto.amount,
          currency: dto.currency,
          payment_method: 'juice',
          status: 'pending',
        },
      });

      return {
        success: true,
        transaction_id: simulatedTxId,
        message: 'Development mode: Payment simulation. In production, customer would be redirected to Juice app.',
      };
    }

    try {
      // Example MIPS/Paywise API call structure (adjust based on actual API documentation)
      const response = await this.mipsClient.post('/payments/initiate', {
        amount: dto.amount,
        currency: dto.currency,
        paymentMethod: 'juice', // or 'mcb_juice'
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        order_id: dto.orderId.toString(),
        returnUrl: dto.returnUrl,
        cancelUrl: dto.cancelUrl,
        metadata: {
          source: 'fresh_roots_app',
          orderRef: `ORDER-${dto.orderId}`,
        },
      });

      const { transactionId, paymentUrl, qrCodeUrl } = response.data;

      // Save transaction record
      await this.prisma.payment_transactions.create({
        data: {
          order_id: dto.orderId.toString(),
          transaction_id: transactionId,
          amount: dto.amount,
          currency: dto.currency,
          payment_method: 'juice',
          status: 'pending',
        },
      });

      // Track event
      await this.posthog.track(
        dto.customerEmail,
        'payment_initiated',
        {
          order_id: dto.orderId,
          amount: dto.amount,
          currency: dto.currency,
          paymentMethod: 'juice',
        },
      );

      this.logger.log(`✅ Juice payment initiated: ${transactionId}`);

      return {
        success: true,
        transaction_id: transactionId,
        paymentUrl: paymentUrl,
        qrCode: qrCodeUrl,
      };
    } catch (error) {
      this.logger.error('Failed to initiate Juice payment:', error);
      throw new BadRequestException('Failed to initiate payment. Please try again.');
    }
  }

  /**
   * Handle payment webhook from MIPS
   * This endpoint will be called by MIPS when payment status changes
   */
  async handleWebhook(payload: any, signature: string): Promise<void> {
    // Verify webhook signature
    const webhookSecret = this.configService.get<string>('MIPS_WEBHOOK_SECRET');
    
    // TODO: Implement signature verification based on MIPS documentation
    // const isValid = this.verifyWebhookSignature(payload, signature, webhookSecret);
    // if (!isValid) {
    //   throw new BadRequestException('Invalid webhook signature');
    // }

    const { transactionId, status, orderId, amount } = payload;

    // Update payment transaction
    const transaction = await this.prisma.payment_transactions.updateMany({
      where: { transaction_id: transactionId },
      data: {
        status: status === 'success' ? 'completed' : status === 'failed' ? 'failed' : 'pending',
        updated_at: new Date(),
      },
    });

    // If payment successful, update order status
    if (status === 'success') {
      await this.prisma.orders.update({
        where: { id: orderId },
        data: {
          payment_status: 'completed',
          order_status: 'pending', // Awaiting admin approval
        },
      });

      // Track successful payment
      await this.posthog.track(
        `order-${orderId}`,
        'payment_completed',
        {
          transactionId,
          amount,
          paymentMethod: 'juice',
        },
      );

      this.logger.log(`✅ Payment completed for order ${orderId}`);
    } else if (status === 'failed') {
      await this.prisma.orders.update({
        where: { id: orderId },
        data: { payment_status: 'failed' },
      });

      this.logger.warn(`❌ Payment failed for order ${orderId}`);
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(transaction_id: string): Promise<any> {
    if (!this.mipsEnabled) {
      const transaction = await this.prisma.payment_transactions.findFirst({
        where: { transaction_id },
      });
      return transaction;
    }

    try {
      const response = await this.mipsClient.get(`/payments/${transaction_id}`);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get payment status:', error);
      throw new BadRequestException('Failed to fetch payment status');
    }
  }
}
