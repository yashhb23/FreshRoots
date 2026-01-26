import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostHogService } from '../analytics/posthog.service';
import { EmailService } from '../notifications/email.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';

@Injectable()
export class InterestService {
  private readonly logger = new Logger(InterestService.name);

  constructor(
    private prisma: PrismaService,
    private posthog: PostHogService,
    private emailService: EmailService,
  ) {}

  async create(createInterestDto: CreateInterestDto, userId: string) {
    // Check if listing exists
    const listing = await this.prisma.listings.findUnique({
      where: { id: createInterestDto.listing_id },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Check for existing active interest
    const existingInterest = await this.prisma.interest_expressions.findFirst({
      where: {
        user_id: userId,
        listing_id: createInterestDto.listing_id,
        status: { in: ['pending', 'contacted'] },
      },
    });

    if (existingInterest) {
      throw new ConflictException('You have already expressed interest in this listing');
    }

    const interest = await this.prisma.interest_expressions.create({
      data: {
        user_id: userId,
        listing_id: createInterestDto.listing_id,
        message: createInterestDto.message,
      },
      include: {
        listing: {
          include: {
            images: {
              take: 1,
              orderBy: { order: 'asc' },
            },
          },
        },
        user: true,
      },
    });

    this.logger.log(`Interest expressed: User ${userId} for listing ${listing.title}`);

    // Track event in PostHog
    await this.posthog.track(userId, 'interest_expressed', {
      listing_id: listing.id,
      listing_title: listing.title,
      listing_price: listing.price,
      has_message: !!createInterestDto.message,
    });

    // Send email notification to admin
    await this.emailService.notifyAdminInterestExpressed(
      listing.title,
      interest.user.name,
      interest.user.email,
      interest.user.phone || 'Not provided',
      createInterestDto.message || 'No message provided',
    );

    return interest;
  }

  async findMyInterests(userId: string) {
    const interests = await this.prisma.interest_expressions.findMany({
      where: { user_id: userId },
      include: {
        listing: {
          include: {
            images: {
              take: 1,
              orderBy: { order: 'asc' },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return interests;
  }

  async findAllAdmin() {
    const interests = await this.prisma.interest_expressions.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        listing: {
          include: {
            images: {
              take: 1,
              orderBy: { order: 'asc' },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return interests;
  }

  async update(id: string, updateInterestDto: UpdateInterestDto) {
    const interest = await this.prisma.interest_expressions.findUnique({
      where: { id },
    });

    if (!interest) {
      throw new NotFoundException('Interest expression not found');
    }

    const updated = await this.prisma.interest_expressions.update({
      where: { id },
      data: { status: updateInterestDto.status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        listing: true,
      },
    });

    this.logger.log(`Interest status updated: ${id} to ${updateInterestDto.status}`);
    return updated;
  }
}
