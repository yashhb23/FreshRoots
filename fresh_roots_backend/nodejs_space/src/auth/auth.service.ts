import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { PostHogService } from '../analytics/posthog.service';
import { EmailService } from '../notifications/email.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private posthog: PostHogService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, phone } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.prisma.users.create({
      data: {
        email,
        password_hash,
        name,
        phone,
        role: 'user',
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        created_at: true,
      },
    });

    this.logger.log(`New user registered: ${email}`);

    // Track registration in PostHog
    await this.posthog.identify(user.id.toString(), {
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    });
    await this.posthog.track(user.id.toString(), 'user_registered', {
      email: user.email,
      name: user.name,
    });

    // Send registration notification emails (async, don't block response)
    this.emailService.notifyRegistration(
      user.name,
      user.email,
      new Date(),
      user.phone,
    ).catch(error => {
      this.logger.error('Failed to send registration notification emails', error);
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is disabled');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in: ${email}`);

    // Track login in PostHog
    await this.posthog.track(user.id.toString(), 'user_logged_in', {
      email: user.email,
      role: user.role,
    });

    // Send login notification emails (async, don't block response)
    this.emailService.notifyLogin(
      user.name,
      user.email,
      new Date(),
      user.phone,
    ).catch(error => {
      this.logger.error('Failed to send login notification emails', error);
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Verify user still exists and is active
      const user = await this.prisma.users.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.is_active) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user.id, user.email, user.role);
      
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessTokenOptions = {
      secret: this.configService.get('JWT_SECRET') || 'fallback-secret',
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '15m',
    };

    const refreshTokenOptions = {
      secret: this.configService.get('JWT_REFRESH_SECRET') || 'fallback-refresh-secret',
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '30d',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, accessTokenOptions),
      this.jwtService.signAsync(payload, refreshTokenOptions),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
