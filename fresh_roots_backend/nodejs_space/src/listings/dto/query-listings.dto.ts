import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean, IsIn, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

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

  @ApiProperty({ required: false, example: 20, description: 'Minimum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({ required: false, example: 150, description: 'Maximum price filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({ required: false, example: true, description: 'Only show items with stock > 0' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  inStockOnly?: boolean;

  @ApiProperty({
    required: false,
    example: 'price_asc',
    description: 'Sort order',
    enum: ['price_asc', 'price_desc', 'created_desc', 'popular'],
  })
  @IsOptional()
  @IsIn(['price_asc', 'price_desc', 'created_desc', 'popular'])
  sortBy?: 'price_asc' | 'price_desc' | 'created_desc' | 'popular';
}
