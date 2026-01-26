import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { EmailService } from '../notifications/email.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, EmailService],
})
export class OrdersModule {}
