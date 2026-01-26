import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InterestService } from './interest.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Interest Expressions')
@Controller('interest')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Express interest in a listing' })
  @ApiResponse({ status: 201, description: 'Interest expressed successfully' })
  @ApiResponse({ status: 404, description: 'Listing not found' })
  @ApiResponse({ status: 409, description: 'Already expressed interest' })
  async create(
    @Body() createInterestDto: CreateInterestDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const interest = await this.interestService.create(createInterestDto, user.sub);
    return {
      success: true,
      data: interest,
    };
  }

  @Get('my-interests')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my interest expressions' })
  @ApiResponse({ status: 200, description: 'List of user interest expressions' })
  async findMyInterests(@CurrentUser() user: JwtPayload) {
    const interests = await this.interestService.findMyInterests(user.sub);
    return {
      success: true,
      data: interests,
    };
  }

  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all interest expressions (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all interest expressions' })
  async findAllAdmin() {
    const interests = await this.interestService.findAllAdmin();
    return {
      success: true,
      data: interests,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update interest status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Interest status updated' })
  @ApiResponse({ status: 404, description: 'Interest not found' })
  async update(
    @Param('id') id: string,
    @Body() updateInterestDto: UpdateInterestDto,
  ) {
    const interest = await this.interestService.update(id, updateInterestDto);
    return {
      success: true,
      data: interest,
    };
  }
}
