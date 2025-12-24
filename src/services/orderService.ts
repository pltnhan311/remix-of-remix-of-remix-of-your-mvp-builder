import { Order, OrderStatus, CustomerInfo, OrderFilter, PaginatedResponse } from '@/types';
import { orderRepository } from '@/repositories';
import { cartService } from './cartService';
import { productService } from './productService';
import { authService } from './authService';

class OrderService {
  // Get order by ID
  getById(id: string): Order | null {
    return orderRepository.getById(id);
  }

  // Get order by code
  getByCode(orderCode: string): Order | null {
    return orderRepository.getByOrderCode(orderCode);
  }

  // Get current user's orders
  getMyOrders(): Order[] {
    const user = authService.getCurrentUser();
    if (!user) return [];
    return orderRepository.getByUserId(user.id);
  }

  // Create order from cart
  createOrder(customer: CustomerInfo): { success: boolean; error?: string; order?: Order } {
    // Validate cart
    const validation = cartService.validate();
    if (!validation.valid) {
      return { success: false, error: validation.errors[0] };
    }

    const cartItems = cartService.getItems();
    if (cartItems.length === 0) {
      return { success: false, error: 'Giỏ hàng trống' };
    }

    // Get current user (optional)
    const user = authService.getCurrentUser();

    // Create order
    const order: Order = {
      id: crypto.randomUUID(),
      orderCode: orderRepository.generateOrderCode(),
      userId: user?.id,
      customer,
      items: cartItems.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        comboId: item.comboId,
        name: item.name,
        variantName: item.variantName,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      subtotal: cartService.getSubtotal(),
      shippingFee: cartService.getShippingFee(),
      total: cartService.getTotal(),
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orderRepository.create(order);

    // Clear cart
    cartService.clearCart();

    return { success: true, order };
  }

  // Cancel order (customer can cancel pending orders)
  cancelOrder(orderId: string): { success: boolean; error?: string } {
    const order = orderRepository.getById(orderId);
    if (!order) {
      return { success: false, error: 'Đơn hàng không tồn tại' };
    }

    // Check authorization
    const user = authService.getCurrentUser();
    const isAdmin = authService.isAdmin();
    
    if (!isAdmin && order.userId !== user?.id) {
      return { success: false, error: 'Không có quyền hủy đơn hàng này' };
    }

    // Can only cancel pending orders (customer) or pending/processing (admin)
    if (!isAdmin && order.status !== 'pending') {
      return { success: false, error: 'Chỉ có thể hủy đơn hàng chưa xử lý' };
    }

    if (isAdmin && !['pending', 'processing'].includes(order.status)) {
      return { success: false, error: 'Không thể hủy đơn hàng đã giao' };
    }

    // If order was processing, restore stock
    if (order.status === 'processing') {
      this.restoreStock(order);
    }

    orderRepository.updateStatus(orderId, 'cancelled', 'Đơn hàng đã bị hủy');

    return { success: true };
  }

  // ============= Admin Methods =============

  // Filter orders (admin)
  filter(filter: OrderFilter, page = 1, limit = 20): PaginatedResponse<Order> {
    return orderRepository.filter(filter, page, limit);
  }

  // Get all orders (admin)
  getAll(): Order[] {
    return orderRepository.getAll();
  }

  // Update order status (admin)
  updateStatus(orderId: string, status: OrderStatus, note?: string): { success: boolean; error?: string } {
    const order = orderRepository.getById(orderId);
    if (!order) {
      return { success: false, error: 'Đơn hàng không tồn tại' };
    }

    // Validate status transition
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: []
    };

    if (!validTransitions[order.status].includes(status)) {
      return { success: false, error: 'Không thể chuyển sang trạng thái này' };
    }

    // Deduct stock when moving to processing
    if (status === 'processing' && order.status === 'pending') {
      const stockResult = this.deductStock(order);
      if (!stockResult.success) {
        return stockResult;
      }
    }

    // Restore stock when cancelling from processing
    if (status === 'cancelled' && order.status === 'processing') {
      this.restoreStock(order);
    }

    orderRepository.updateStatus(orderId, status, note);

    return { success: true };
  }

  // Get statistics (admin)
  getStats(dateFrom?: string, dateTo?: string) {
    return orderRepository.getStats(dateFrom, dateTo);
  }

  // ============= Private Methods =============

  // Deduct stock for order items
  private deductStock(order: Order): { success: boolean; error?: string } {
    for (const item of order.items) {
      const stock = productService.getStock(item.productId, item.variantId);
      if (stock < item.quantity) {
        return { 
          success: false, 
          error: `Sản phẩm "${item.name}" không đủ số lượng (còn ${stock})` 
        };
      }
    }

    // All stock available, now deduct
    for (const item of order.items) {
      if (item.variantId) {
        productService.updateStock(item.productId, item.variantId, -item.quantity);
      }
    }

    return { success: true };
  }

  // Restore stock for cancelled order
  private restoreStock(order: Order): void {
    for (const item of order.items) {
      if (item.variantId) {
        productService.updateStock(item.productId, item.variantId, item.quantity);
      }
    }
  }
}

export const orderService = new OrderService();
