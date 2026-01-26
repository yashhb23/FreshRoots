import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PostHogService } from '../analytics/posthog.service';
import { EmailService } from '../notifications/email.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private posthog: PostHogService,
    private emailService: EmailService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const { items, payment_method } = createOrderDto;

    if (items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Fetch all listings and validate
    const listingIds = items.map(item => item.listing_id);
    const listings = await this.prisma.listings.findMany({
      where: {
        id: { in: listingIds },
        is_active: true,
      },
    });

    if (listings.length !== items.length) {
      throw new BadRequestException('Some listings are not available');
    }

    // Check stock availability
    for (const item of items) {
      const listing = listings.find((l: any) => l.id === item.listing_id);
      if (!listing) {
        throw new BadRequestException(`Listing ${item.listing_id} not found`);
      }
      if (listing.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${listing.title}. Available: ${listing.stock}`,
        );
      }
    }

    // Calculate total
    let subtotal = 0;
    const orderItems = items.map(item => {
      const listing = listings.find((l: any) => l.id === item.listing_id);
      if (!listing) {
        throw new BadRequestException(`Listing ${item.listing_id} not found`);
      }
      const itemSubtotal = listing.price * item.quantity;
      subtotal += itemSubtotal;
      
      return {
        listing_id: item.listing_id,
        quantity: item.quantity,
        unit_price: listing.price,
        subtotal: itemSubtotal,
      };
    });

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Create order with items in a transaction
    const order = await this.prisma.$transaction(async (tx: any) => {
      const newOrder = await tx.orders.create({
        data: {
          user_id: userId,
          order_number: orderNumber,
          payment_method,
          total_amount: subtotal,
          order_status: 'pending',
          payment_status: 'pending',
        },
      });

      await tx.order_items.createMany({
        data: orderItems.map(item => ({
          order_id: newOrder.id,
          ...item,
        })),
      });

      // Decrement stock
      for (const item of items) {
        await tx.listings.update({
          where: { id: item.listing_id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    this.logger.log(`Order created: ${orderNumber} by user ${userId}`);

    // Fetch full order details with user for notifications
    const fullOrder = await this.prisma.orders.findUnique({
      where: { id: order.id },
      include: {
        user: true,
        order_items: {
          include: {
            listing: true,
          },
        },
      },
    });

    if (!fullOrder) {
      this.logger.error(`Order ${order.id} not found after creation`);
      return this.findOne(order.id, userId);
    }

    // Track event in PostHog
    await this.posthog.track(userId, 'order_created', {
      order_id: order.id,
      order_number: orderNumber,
      total_amount: subtotal,
      payment_method,
      items_count: items.length,
    });

    // Send email notifications
    const itemsForEmail = fullOrder.order_items.map((item: any) => ({
      productName: item.listing.title,
      quantity: item.quantity,
      price: item.subtotal,
    }));

    // Notify admin
    await this.emailService.notifyAdminOrderPlaced(
      orderNumber,
      fullOrder.user.name,
      fullOrder.user.email,
      fullOrder.user.phone || 'Not provided',
      itemsForEmail,
      subtotal,
      payment_method,
    );

    // Send confirmation to customer
    await this.emailService.sendOrderConfirmation(
      fullOrder.user.email,
      fullOrder.user.name,
      orderNumber,
      itemsForEmail,
      subtotal,
      payment_method,
    );

    return this.findOne(order.id, userId);
  }

  async findMyOrders(userId: string) {
    const orders = await this.prisma.orders.findMany({
      where: { user_id: userId },
      include: {
        order_items: {
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
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return orders;
  }

  async findOne(id: string, userId?: string) {
    const order = await this.prisma.orders.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        order_items: {
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
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // If userId provided, verify ownership
    if (userId && order.user_id !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findAllAdmin() {
    const orders = await this.prisma.orders.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        order_items: {
          include: {
            listing: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return orders;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto, adminId: string) {
    const order = await this.findOne(id);

    const updatedOrder = await this.prisma.$transaction(async (tx: any) => {
      // Update order status
      const updated = await tx.orders.update({
        where: { id },
        data: { order_status: updateOrderStatusDto.status },
      });

      // Log admin action
      await tx.admin_actions.create({
        data: {
          admin_id: adminId,
          order_id: id,
          action_type: 'order_status_updated',
          notes: updateOrderStatusDto.notes || `Status changed to ${updateOrderStatusDto.status}`,
        },
      });

      return updated;
    });

    this.logger.log(
      `Order ${order.order_number} status updated to ${updateOrderStatusDto.status} by admin ${adminId}`,
    );

    return this.findOne(id);
  }

  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.orders.count();
    const orderNum = (count + 1).toString().padStart(6, '0');
    return `FR-${year}-${orderNum}`;
  }
}
