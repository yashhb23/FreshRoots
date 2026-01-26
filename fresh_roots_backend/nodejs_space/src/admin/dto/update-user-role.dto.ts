import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ example: 'admin', enum: ['admin', 'user'] })
  @IsEnum(['admin', 'user'])
  role: string;
}
