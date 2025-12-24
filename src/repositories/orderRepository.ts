import { BaseRepository } from './baseRepository';
import { Order, OrderFilter, OrderStatus, PaginatedResponse } from '@/types';

class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super('noel_orders');
  }

  // Get by order code
  getByOrderCode(orderCode: string): Order | null {
    const orders = this.getAll();
    return orders.find(o => o.orderCode === orderCode) || null;
  }

  // Get orders by user
  getByUserId(userId: string): Order[] {
    const orders = this.getAll();
    return orders.filter(o => o.userId === userId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Get orders by status
  getByStatus(status: OrderStatus): Order[] {
    const orders = this.getAll();
    return orders.filter(o => o.status === status);
  }

  // Filter orders with pagination
  filter(filter: OrderFilter, page = 1, limit = 20): PaginatedResponse<Order> {
    let orders = this.getAll();

    // Filter by status
    if (filter.status) {
      orders = orders.filter(o => o.status === filter.status);
    }

    // Filter by user
    if (filter.userId) {
      orders = orders.filter(o => o.userId === filter.userId);
    }

    // Filter by date range
    if (filter.dateFrom) {
      orders = orders.filter(o => new Date(o.createdAt) >= new Date(filter.dateFrom!));
    }
    if (filter.dateTo) {
      orders = orders.filter(o => new Date(o.createdAt) <= new Date(filter.dateTo!));
    }

    // Filter by search (order code or customer name/phone)
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      orders = orders.filter(o => 
        o.orderCode.toLowerCase().includes(searchLower) ||
        o.customer.fullName.toLowerCase().includes(searchLower) ||
        o.customer.phone.includes(filter.search!)
      );
    }

    // Sort by date (newest first)
    orders = orders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pagination
    const total = orders.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedOrders = orders.slice(startIndex, startIndex + limit);

    return {
      data: paginatedOrders,
      total,
      page,
      limit,
      totalPages
    };
  }

  // Update order status
  updateStatus(orderId: string, status: OrderStatus, note?: string): Order | null {
    const order = this.getById(orderId);
    if (!order) return null;

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note
    });
    order.updatedAt = new Date().toISOString();

    return this.update(orderId, order);
  }

  // Generate order code
  generateOrderCode(): string {
    const year = new Date().getFullYear();
    const orders = this.getAll();
    const yearOrders = orders.filter(o => o.orderCode.includes(`NOEL-${year}`));
    const nextNumber = yearOrders.length + 1;
    return `NOEL-${year}-${nextNumber.toString().padStart(4, '0')}`;
  }

  // Get statistics
  getStats(dateFrom?: string, dateTo?: string) {
    let orders = this.getAll();

    if (dateFrom) {
      orders = orders.filter(o => new Date(o.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
      orders = orders.filter(o => new Date(o.createdAt) <= new Date(dateTo));
    }

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / (totalOrders - cancelledOrders) : 0;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      averageOrderValue: isNaN(averageOrderValue) ? 0 : averageOrderValue
    };
  }
}

export const orderRepository = new OrderRepository();
