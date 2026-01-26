import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingsDto } from './dto/query-listings.dto';

@Injectable()
export class ListingsService {
  private readonly logger = new Logger(ListingsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createListingDto: CreateListingDto, adminId: string) {
    const { imageUrls, ...listingData } = createListingDto;

    const listing = await this.prisma.listings.create({
      data: {
        ...listingData,
        admin_id: adminId,
      },
    });

    // Add images if provided
    if (imageUrls && imageUrls.length > 0) {
      await this.prisma.listing_images.createMany({
        data: imageUrls.map((url, index) => ({
          listing_id: listing.id,
          image_url: url,
          is_primary: index === 0,
          order: index,
        })),
      });
    }

    this.logger.log(`Listing created: ${listing.title} by admin ${adminId}`);

    return this.findOne(listing.id);
  }

  async findAll(query: QueryListingsDto) {
    const { page = 1, limit = 20, category, search, tags } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      is_active: true,
    };

    if (category) {
      where.category_id = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      where.tags = { hasSome: tagArray };
    }

    const [listings, total] = await Promise.all([
      this.prisma.listings.findMany({
        where,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { order: 'asc' },
            take: 1,
          },
          category: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.listings.count({ where }),
    ]);

    return {
      data: listings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  async findOne(id: string) {
    const listing = await this.prisma.listings.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        category: true,
        admin: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return listing;
  }

  async findAllAdmin(adminId: string) {
    const listings = await this.prisma.listings.findMany({
      where: { admin_id: adminId },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        category: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return listings;
  }

  async update(id: string, updateListingDto: UpdateListingDto, adminId: string) {
    const existingListing = await this.findOne(id);

    // Check if admin owns this listing
    if (existingListing.admin_id !== adminId) {
      throw new ForbiddenException('You can only update your own listings');
    }

    const { imageUrls, ...updateData } = updateListingDto;

    const listing = await this.prisma.listings.update({
      where: { id },
      data: updateData,
    });

    // Update images if provided
    if (imageUrls && imageUrls.length > 0) {
      // Delete existing images
      await this.prisma.listing_images.deleteMany({
        where: { listing_id: id },
      });

      // Add new images
      await this.prisma.listing_images.createMany({
        data: imageUrls.map((url, index) => ({
          listing_id: listing.id,
          image_url: url,
          is_primary: index === 0,
          order: index,
        })),
      });
    }

    this.logger.log(`Listing updated: ${listing.title} by admin ${adminId}`);

    return this.findOne(listing.id);
  }

  async remove(id: string, adminId: string) {
    const listing = await this.findOne(id);

    // Check if admin owns this listing
    if (listing.admin_id !== adminId) {
      throw new ForbiddenException('You can only delete your own listings');
    }

    // Soft delete by setting is_active to false
    await this.prisma.listings.update({
      where: { id },
      data: { is_active: false },
    });

    this.logger.log(`Listing deactivated: ${listing.title} by admin ${adminId}`);

    return { message: 'Listing deactivated successfully' };
  }
}
