import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateInterestDto {
  @ApiProperty({ example: 'listing-uuid' })
  @IsString()
  @IsNotEmpty()
  listing_id: string;

  @ApiProperty({ example: 'I am interested in bulk purchase', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}
