import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/overview')
  @Roles('admin')
  @ApiOperation({ summary: 'Get admin dashboard overview with key metrics' })
  @ApiResponse({ status: 200, description: 'Dashboard overview retrieved successfully' })
  async getDashboardOverview() {
    return this.adminService.getDashboardOverview();
  }

  @Get('dashboard/stats')
  @Roles('admin')
  @ApiOperation({ summary: 'Get detailed statistics for admin dashboard' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d', 'all'], description: 'Time period for stats' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStatistics(@Query('period') period?: string) {
    return this.adminService.getStatistics(period || '30d');
  }

  @Get('analytics/sales')
  @Roles('admin')
  @ApiOperation({ summary: 'Get sales analytics' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d'], description: 'Time period' })
  @ApiResponse({ status: 200, description: 'Sales analytics retrieved' })
  async getSalesAnalytics(@Query('period') period?: string) {
    return this.adminService.getSalesAnalytics(period || '30d');
  }

  @Get('analytics/products')
  @Roles('admin')
  @ApiOperation({ summary: 'Get product performance analytics' })
  @ApiResponse({ status: 200, description: 'Product analytics retrieved' })
  async getProductAnalytics() {
    return this.adminService.getProductAnalytics();
  }

  @Get('users')
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by name or email' })
  @ApiQuery({ name: 'role', required: false, enum: ['admin', 'user'], description: 'Filter by role' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getAllUsers(
      parseInt(page || '1'),
      parseInt(limit || '20'),
      search,
      role,
    );
  }

  @Get('users/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get detailed user information' })
  @ApiResponse({ status: 200, description: 'User details retrieved successfully' })
  async getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Patch('users/:id/role')
  @Roles('admin')
  @ApiOperation({ summary: 'Update user role (admin only)' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    return this.adminService.updateUserRole(id, updateUserRoleDto.role);
  }

  @Delete('users/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete user account (soft delete)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('reports/revenue')
  @Roles('admin')
  @ApiOperation({ summary: 'Get revenue report' })
  @ApiQuery({ name: 'startDate', required: false, type: String, example: '2026-01-01' })
  @ApiQuery({ name: 'endDate', required: false, type: String, example: '2026-01-31' })
  @ApiResponse({ status: 200, description: 'Revenue report generated' })
  async getRevenueReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getRevenueReport(startDate, endDate);
  }

  @Get('reports/inventory')
  @Roles('admin')
  @ApiOperation({ summary: 'Get inventory status report' })
  @ApiResponse({ status: 200, description: 'Inventory report generated' })
  async getInventoryReport() {
    return this.adminService.getInventoryReport();
  }

  @Get('activity-log')
  @Roles('admin')
  @ApiOperation({ summary: 'Get admin activity log' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({ status: 200, description: 'Activity log retrieved' })
  async getActivityLog(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getActivityLog(
      parseInt(page || '1'),
      parseInt(limit || '50'),
    );
  }
}
