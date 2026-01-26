import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, adminId: string) {
    // Check if slug already exists
    const existingCategory = await this.prisma.categories.findUnique({
      where: { slug: createCategoryDto.slug },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this slug already exists');
    }

    const category = await this.prisma.categories.create({
      data: createCategoryDto,
    });

    this.logger.log(`Category created: ${category.name} by admin ${adminId}`);
    return category;
  }

  async findAll() {
    const categories = await this.prisma.categories.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { listings: true },
        },
      },
    });

    return categories;
  }

  async findOne(id: string) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
      include: {
        _count: {
          select: { listings: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, adminId: string) {
    // Check if category exists
    await this.findOne(id);

    // If slug is being updated, check for conflicts
    if (updateCategoryDto.slug) {
      const existingCategory = await this.prisma.categories.findUnique({
        where: { slug: updateCategoryDto.slug },
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    const category = await this.prisma.categories.update({
      where: { id },
      data: updateCategoryDto,
    });

    this.logger.log(`Category updated: ${category.name} by admin ${adminId}`);
    return category;
  }

  async remove(id: string, adminId: string) {
    // Check if category exists
    const category = await this.findOne(id);

    // Check if category has listings
    const listingsCount = await this.prisma.listings.count({
      where: { category_id: id },
    });

    if (listingsCount > 0) {
      throw new ConflictException(
        `Cannot delete category with ${listingsCount} active listings`,
      );
    }

    await this.prisma.categories.delete({
      where: { id },
    });

    this.logger.log(`Category deleted: ${category.name} by admin ${adminId}`);
    return { message: 'Category deleted successfully' };
  }
}
