import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, Min } from 'class-validator';

export class CreateListingDto {
  @ApiProperty({ example: 'Organic Tomatoes' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Fresh organic tomatoes from Plaine Magnien', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 85.00 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'kg' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'category-uuid', required: false })
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiProperty({ example: 'Plaine Magnien', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: ['organic', 'local', 'fresh'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: ['https://example.com/image1.jpg'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
