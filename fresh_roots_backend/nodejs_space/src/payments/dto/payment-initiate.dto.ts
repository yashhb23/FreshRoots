import { IsNumber, IsString, IsEmail, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentInitiateDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  orderId: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'MUR' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ required: false, example: '+23054321234' })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({ example: 'https://yourapp.com/payment/success' })
  @IsUrl()
  returnUrl: string;

  @ApiProperty({ example: 'https://yourapp.com/payment/cancel' })
  @IsUrl()
  cancelUrl: string;
}
