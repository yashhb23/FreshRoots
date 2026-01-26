import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { InterestStatus } from '@prisma/client';

export class UpdateInterestDto {
  @ApiProperty({ enum: InterestStatus })
  @IsEnum(InterestStatus)
  status: InterestStatus;
}
