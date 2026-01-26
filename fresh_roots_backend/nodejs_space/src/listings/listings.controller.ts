import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingsDto } from './dto/query-listings.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new listing (Admin only)' })
  @ApiResponse({ status: 201, description: 'Listing created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async create(
    @Body() createListingDto: CreateListingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const listing = await this.listingsService.create(createListingDto, user.sub);
    return {
      success: true,
      data: listing,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all active listings with filters' })
  @ApiResponse({ status: 200, description: 'List of listings' })
  async findAll(@Query() query: QueryListingsDto) {
    const result = await this.listingsService.findAll(query);
    return {
      success: true,
      ...result,
    };
  }

  @Get('admin/my-listings')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all listings by current admin' })
  @ApiResponse({ status: 200, description: 'List of admin listings' })
  async findAllAdmin(@CurrentUser() user: JwtPayload) {
    const listings = await this.listingsService.findAllAdmin(user.sub);
    return {
      success: true,
      data: listings,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get listing by ID' })
  @ApiResponse({ status: 200, description: 'Listing details' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async findOne(@Param('id') id: string) {
    const listing = await this.listingsService.findOne(id);
    return {
      success: true,
      data: listing,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update listing (Admin only)' })
  @ApiResponse({ status: 200, description: 'Listing updated successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async update(
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const listing = await this.listingsService.update(id, updateListingDto, user.sub);
    return {
      success: true,
      data: listing,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate listing (Admin only)' })
  @ApiResponse({ status: 200, description: 'Listing deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const result = await this.listingsService.remove(id, user.sub);
    return {
      success: true,
      data: result,
    };
  }
}
