import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

/**
 * DTO for Google OAuth authentication.
 * The mobile app sends Google user info after Firebase Google Sign-In.
 */
export class GoogleAuthDto {
  @ApiProperty({ example: 'user@gmail.com', description: 'Google account email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Display name from Google' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '1234567890', description: 'Google user ID', required: false })
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiProperty({ example: 'https://...', description: 'Profile photo URL', required: false })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
