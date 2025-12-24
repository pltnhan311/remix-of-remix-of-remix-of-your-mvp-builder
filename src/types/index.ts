// ============= Entity Types =============

// Product Variant (màu sắc, kích thước)
export interface ProductVariant {
  id: string;
  name: string; // "Đỏ", "Xanh", "1.5m", "2m"
  type: 'color' | 'size';
  value: string; // hex color hoặc size value
  stock: number;
  priceModifier: number; // Thay đổi giá so với giá gốc (có thể âm hoặc dương)
}

// Product
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // Giá gốc
  images: string[];
  categoryId: string;
  variants: ProductVariant[];
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
}

// Combo - Bộ sưu tập sản phẩm
export interface ComboItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface Combo {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  items: ComboItem[];
  originalPrice: number; // Tổng giá gốc các sản phẩm
  discountPrice: number; // Giá combo sau giảm
  discountPercent: number;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cart Item
export interface CartItem {
  productId: string;
  variantId?: string;
  comboId?: string; // Nếu là combo
  quantity: number;
  price: number; // Giá tại thời điểm thêm vào giỏ
  name: string;
  image: string;
  variantName?: string;
}

// Cart
export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

// Order Status
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Order Item
export interface OrderItem {
  productId: string;
  variantId?: string;
  comboId?: string;
  name: string;
  variantName?: string;
  quantity: number;
  price: number;
  image: string;
}

// Customer Info for Order
export interface CustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  note?: string;
}

// Order
export interface Order {
  id: string;
  orderCode: string; // NOEL-2024-XXXX
  userId?: string; // Optional - guest checkout allowed
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// User Role
export type UserRole = 'customer' | 'admin';

// User
export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  password: string; // Hashed - chỉ dùng cho demo
  role: UserRole;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Session
export interface AuthSession {
  userId: string;
  role: UserRole;
  expiresAt: string;
}

// Banner
export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============= API Response Types =============

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============= Filter Types =============

export interface ProductFilter {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featured?: boolean;
  active?: boolean;
}

export interface OrderFilter {
  status?: OrderStatus;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
