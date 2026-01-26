import { PartialType } from '@nestjs/swagger';
import { CreateListingDto } from './create-listing.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateListingDto extends PartialType(CreateListingDto) {
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
