import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryListingsDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiProperty({ required: false, example: 'category-uuid' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, example: 'tomato' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, example: 'organic' })
  @IsOptional()
  @IsString()
  tags?: string;
}
