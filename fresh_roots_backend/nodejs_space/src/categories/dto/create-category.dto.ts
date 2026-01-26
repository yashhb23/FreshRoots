import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Vegetables' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'vegetables' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Fresh vegetables from local farms', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://cdn-icons-png.flaticon.com/512/10107/10107601.png', required: false })
  @IsOptional()
  @IsString()
  icon?: string;
}
