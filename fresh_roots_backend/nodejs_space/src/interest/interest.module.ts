import { Module } from '@nestjs/common';
import { InterestService } from './interest.service';
import { InterestController } from './interest.controller';
import { EmailService } from '../notifications/email.service';

@Module({
  controllers: [InterestController],
  providers: [InterestService, EmailService],
})
export class InterestModule {}
