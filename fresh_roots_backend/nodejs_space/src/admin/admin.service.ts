import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostHogService } from '../analytics/posthog.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private prisma: PrismaService,
    private posthog: PostHogService,
  ) {}

  /**
   * Get admin dashboard overview with key metrics
   */
  async getDashboardOverview() {
    const [totalUsers, totalOrders, totalRevenue, totalListings, pendingOrders, lowStockItems] = await Promise.all([
      this.prisma.users.count(),
      this.prisma.orders.count(),
      this.prisma.orders.aggregate({
        where: { payment_status: 'completed' },
        _sum: { total_amount: true },
      }),
      this.prisma.listings.count({ where: { is_active: true } }),
      this.prisma.orders.count({ where: { order_status: 'pending' } }),
      this.prisma.listings.count({ where: { stock: { lte: 10 }, is_active: true } }),
    ]);

    // Get recent orders
    const recentOrders = await this.prisma.orders.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        order_items: {
          include: { listing: { select: { title: true } } },
        },
      },
    });

    // Get popular products (most ordered)
    const popularProducts = await this.prisma.order_items.groupBy({
      by: ['listing_id'],
      _sum: { quantity: true },
      _count: { listing_id: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const popularProductIds = popularProducts.map((p: any) => p.listing_id);
    const productDetails = await this.prisma.listings.findMany({
      where: { id: { in: popularProductIds } },
      select: { id: true, title: true, price: true, images: { take: 1 } },
    });

    const popularProductsWithDetails = popularProducts.map((p: any) => {
      const details = productDetails.find((d: any) => d.id === p.listing_id);
      return {
        listing_id: p.listing_id,
        title: details?.title || 'Unknown',
        total_sold: p._sum.quantity || 0,
        order_count: p._count.listing_id,
        image: details?.images[0]?.image_url,
      };
    });

    return {
      success: true,
      data: {
        metrics: {
          totalUsers,
          totalOrders,
          totalRevenue: totalRevenue._sum.total_amount || 0,
          totalListings,
          pendingOrders,
          lowStockItems,
        },
        recentOrders: recentOrders.map((order: any) => ({
          id: order.id,
          order_number: order.order_number,
          customer: order.user.name,
          customer_email: order.user.email,
          total_amount: order.total_amount,
          payment_status: order.payment_status,
          order_status: order.order_status,
          items_count: order.order_items.length,
          created_at: order.created_at,
        })),
        popularProducts: popularProductsWithDetails,
      },
    };
  }

  /**
   * Get detailed statistics for a specific period
   */
  async getStatistics(period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = new Date(0);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const [newUsers, newOrders, revenue, interestExpressions] = await Promise.all([
      this.prisma.users.count({ where: { created_at: { gte: startDate } } }),
      this.prisma.orders.count({ where: { created_at: { gte: startDate } } }),
      this.prisma.orders.aggregate({
        where: {
          created_at: { gte: startDate },
          payment_status: 'completed',
        },
        _sum: { total_amount: true },
        _avg: { total_amount: true },
      }),
      this.prisma.interest_expressions.count({ where: { created_at: { gte: startDate } } }),
    ]);

    // Calculate growth (compare with previous period)
    const periodDays = Math.ceil((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
    const prevStartDate = new Date(startDate.getTime() - periodDays * 24 * 60 * 60 * 1000);

    const [prevOrders, prevRevenue] = await Promise.all([
      this.prisma.orders.count({
        where: {
          created_at: { gte: prevStartDate, lt: startDate },
        },
      }),
      this.prisma.orders.aggregate({
        where: {
          created_at: { gte: prevStartDate, lt: startDate },
          payment_status: 'completed',
        },
        _sum: { total_amount: true },
      }),
    ]);

    const ordersGrowth = prevOrders > 0 ? ((newOrders - prevOrders) / prevOrders) * 100 : 0;
    const revenueGrowth = prevRevenue._sum.total_amount
      ? ((revenue._sum.total_amount || 0) - prevRevenue._sum.total_amount) / prevRevenue._sum.total_amount * 100
      : 0;

    return {
      success: true,
      data: {
        period,
        periodDays,
        stats: {
          newUsers,
          newOrders,
          totalRevenue: revenue._sum.total_amount || 0,
          averageOrderValue: revenue._avg.total_amount || 0,
          interestExpressions,
        },
        growth: {
          orders: ordersGrowth.toFixed(1),
          revenue: revenueGrowth.toFixed(1),
        },
      },
    };
  }

  /**
   * Get sales analytics with daily breakdown
   */
  async getSalesAnalytics(period: string) {
    const now = new Date();
    let startDate: Date;
    let days: number;

    switch (period) {
      case '7d':
        days = 7;
        startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        days = 30;
        startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        days = 90;
        startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        break;
      default:
        days = 30;
        startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }

    const orders = await this.prisma.orders.findMany({
      where: {
        created_at: { gte: startDate },
        payment_status: 'completed',
      },
      select: {
        created_at: true,
        total_amount: true,
      },
    });

    // Group by day
    const dailySales: { [key: string]: { revenue: number; orders: number } } = {};
    
    orders.forEach((order: any) => {
      const date = order.created_at.toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = { revenue: 0, orders: 0 };
      }
      dailySales[date].revenue += order.total_amount;
      dailySales[date].orders += 1;
    });

    // Format for chart
    const chartData = Object.entries(dailySales)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      }));

    return {
      success: true,
      data: {
        period,
        chartData,
        summary: {
          totalRevenue: orders.reduce((sum: number, o: any) => sum + o.total_amount, 0),
          totalOrders: orders.length,
          averageDaily: orders.length > 0 ? orders.reduce((sum: number, o: any) => sum + o.total_amount, 0) / days : 0,
        },
      },
    };
  }

  /**
   * Get product performance analytics
   */
  async getProductAnalytics() {
    const [topSelling, lowStock, outOfStock, revenueByCategory] = await Promise.all([
      // Top selling products
      this.prisma.order_items.groupBy({
        by: ['listing_id'],
        _sum: { quantity: true, subtotal: true },
        _count: { listing_id: true },
        orderBy: { _sum: { subtotal: 'desc' } },
        take: 10,
      }),
      // Low stock products
      this.prisma.listings.findMany({
        where: { stock: { gt: 0, lte: 10 }, is_active: true },
        select: { id: true, title: true, stock: true, price: true },
        orderBy: { stock: 'asc' },
      }),
      // Out of stock products
      this.prisma.listings.count({
        where: { stock: 0, is_active: true },
      }),
      // Revenue by category
      this.prisma.order_items.findMany({
        select: {
          subtotal: true,
          listing: {
            select: {
              category: { select: { name: true } },
            },
          },
        },
      }),
    ]);

    // Get listing details for top selling
    const topSellingIds = topSelling.map((t: any) => t.listing_id);
    const topSellingDetails = await this.prisma.listings.findMany({
      where: { id: { in: topSellingIds } },
      select: { id: true, title: true, price: true, images: { take: 1 } },
    });

    const topSellingWithDetails = topSelling.map((t: any) => {
      const details = topSellingDetails.find((d: any) => d.id === t.listing_id);
      return {
        listing_id: t.listing_id,
        title: details?.title || 'Unknown',
        price: details?.price || 0,
        total_sold: t._sum.quantity || 0,
        revenue: t._sum.subtotal || 0,
        orders: t._count.listing_id,
        image: details?.images[0]?.image_url,
      };
    });

    // Calculate revenue by category
    const categoryRevenue: { [key: string]: number } = {};
    revenueByCategory.forEach((item: any) => {
      const category = item.listing.category?.name || 'Uncategorized';
      if (!categoryRevenue[category]) {
        categoryRevenue[category] = 0;
      }
      categoryRevenue[category] += item.subtotal;
    });

    return {
      success: true,
      data: {
        topSelling: topSellingWithDetails,
        lowStock,
        outOfStock,
        revenueByCategory: Object.entries(categoryRevenue).map(([name, revenue]) => ({
          category: name,
          revenue,
        })),
      },
    };
  }

  /**
   * Get all users with pagination and filters
   */
  async getAllUsers(page: number, limit: number, search?: string, role?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.users.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          created_at: true,
          _count: {
            select: {
              orders: true,
              interest_expressions: true,
            },
          },
        },
      }),
      this.prisma.users.count({ where }),
    ]);

    return {
      success: true,
      data: {
        users: users.map((user: any) => ({
          ...user,
          orders_count: user._count.orders,
          interests_count: user._count.interest_expressions,
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  /**
   * Get detailed user information
   */
  async getUserDetails(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: {
        orders: {
          orderBy: { created_at: 'desc' },
          take: 10,
          include: {
            order_items: {
              include: { listing: { select: { title: true } } },
            },
          },
        },
        interest_expressions: {
          orderBy: { created_at: 'desc' },
          take: 10,
          include: {
            listing: { select: { title: true } },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Calculate user statistics
    const totalSpent = await this.prisma.orders.aggregate({
      where: {
        user_id: userId,
        payment_status: 'completed',
      },
      _sum: { total_amount: true },
    });

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          created_at: user.created_at,
        },
        statistics: {
          total_orders: user.orders.length,
          total_spent: totalSpent._sum.total_amount || 0,
          interest_expressions: user.interest_expressions.length,
        },
        recentOrders: user.orders,
        recentInterests: user.interest_expressions,
      },
    };
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: string) {
    const user = await this.prisma.users.update({
      where: { id: userId },
      data: { role: role as any },
      select: { id: true, name: true, email: true, role: true },
    });

    this.logger.log(`User role updated: ${user.email} -> ${role}`);

    return {
      success: true,
      message: 'User role updated successfully',
      data: { user },
    };
  }

  /**
   * Delete user (soft delete - just mark orders as archived)
   */
  async deleteUser(userId: string) {
    // Check if user exists
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete user and cascade delete will handle related records
    await this.prisma.users.delete({
      where: { id: userId },
    });

    this.logger.warn(`User deleted: ${user.email}`);

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }

  /**
   * Get revenue report
   */
  async getRevenueReport(startDate?: string, endDate?: string) {
    const where: any = { payment_status: 'completed' };

    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at.gte = new Date(startDate);
      if (endDate) where.created_at.lte = new Date(endDate);
    }

    const [orders, revenueByPaymentMethod] = await Promise.all([
      this.prisma.orders.findMany({
        where,
        select: {
          id: true,
          order_number: true,
          total_amount: true,
          payment_method: true,
          created_at: true,
          user: { select: { name: true, email: true } },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.orders.groupBy({
        by: ['payment_method'],
        where,
        _sum: { total_amount: true },
        _count: { id: true },
      }),
    ]);

    const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.total_amount, 0);

    return {
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalOrders: orders.length,
          averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
        },
        revenueByPaymentMethod: revenueByPaymentMethod.map((r: any) => ({
          method: r.payment_method,
          revenue: r._sum.total_amount || 0,
          orders: r._count.id,
        })),
        orders: orders.slice(0, 50), // Limit to 50 for API response
      },
    };
  }

  /**
   * Get inventory status report
   */
  async getInventoryReport() {
    const [activeListings, inStock, lowStock, outOfStock, totalValue] = await Promise.all([
      this.prisma.listings.count({ where: { is_active: true } }),
      this.prisma.listings.count({ where: { stock: { gt: 10 }, is_active: true } }),
      this.prisma.listings.count({ where: { stock: { gt: 0, lte: 10 }, is_active: true } }),
      this.prisma.listings.count({ where: { stock: 0, is_active: true } }),
      this.prisma.listings.aggregate({
        where: { is_active: true },
        _sum: {
          stock: true,
        },
      }),
    ]);

    const listings = await this.prisma.listings.findMany({
      where: { is_active: true },
      select: {
        id: true,
        title: true,
        stock: true,
        price: true,
        category: { select: { name: true } },
      },
      orderBy: { stock: 'asc' },
    });

    return {
      success: true,
      data: {
        summary: {
          activeListings,
          inStock,
          lowStock,
          outOfStock,
          totalStockUnits: totalValue._sum.stock || 0,
        },
        listings: listings.map((l: any) => ({
          ...l,
          status: l.stock === 0 ? 'out_of_stock' : l.stock <= 10 ? 'low_stock' : 'in_stock',
          category: l.category?.name || 'Uncategorized',
        })),
      },
    };
  }

  /**
   * Get admin activity log
   */
  async getActivityLog(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      this.prisma.admin_actions.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          admin: { select: { name: true, email: true } },
          order: { select: { order_number: true } },
        },
      }),
      this.prisma.admin_actions.count(),
    ]);

    return {
      success: true,
      data: {
        activities: activities.map((a: any) => ({
          id: a.id,
          action: a.action_type,
          admin: a.admin.name,
          admin_email: a.admin.email,
          order_number: a.order?.order_number,
          notes: a.notes,
          timestamp: a.created_at,
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }
}
