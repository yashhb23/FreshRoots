import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({ example: '123 Royal Road', description: 'Street address for delivery' })
  @IsString()
  @IsNotEmpty()
  delivery_address: string;

  @ApiProperty({ example: 'Moka', description: 'District in Mauritius' })
  @IsString()
  @IsNotEmpty()
  delivery_district: string;

  @ApiProperty({ example: 'Port Louis', description: 'City or town' })
  @IsString()
  @IsNotEmpty()
  delivery_city: string;

  @ApiProperty({ example: '11223', description: 'Postal code', required: false })
  @IsString()
  @IsOptional()
  delivery_postal_code?: string;
}
