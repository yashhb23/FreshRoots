// API Response Types (matching backend contract)

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
    details?: any;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'buyer' | 'seller' | 'admin';
  created_at: string;
  updated_at?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  created_at: string;
}

export interface ListingImage {
  id: string;
  image_url: string;
  is_primary: boolean;
  order: number;
}

export interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  unit: string;
  stock: number;
  category?: Category;
  location?: string;
  tags: string[];
  images: ListingImage[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  admin?: {
    name: string;
    email: string;
  };
}

export interface PaginatedListings {
  listings: Listing[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface InterestExpression {
  id: string;
  listing_id?: string;
  listing?: Listing;
  message?: string;
  status: 'pending' | 'contacted' | 'closed';
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  listing_id?: string;
  listing?: Listing;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  payment_method: 'juice' | 'myt_money' | 'card' | 'cash_on_delivery';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  order_status:
    | 'pending'
    | 'payment_pending'
    | 'payment_confirmed'
    | 'approved'
    | 'rejected'
    | 'preparing'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled';
  items: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface PaymentInitiateRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentInitiateResponse {
  transaction_id: string;
  paymentUrl?: string;
  message: string;
}

export interface PaymentStatusResponse {
  transaction_id: string;
  status: 'completed' | 'pending' | 'failed';
  amount: number;
  currency: string;
}

// Local state types (not from API)
export interface CartItem {
  listing: Listing;
  quantity: number;
}

export interface LocalNotification {
  id: string;
  type: 'order_created' | 'interest_sent' | 'order_updated';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface MessageThread {
  id: string;
  title: string;
  listingId?: string;
  lastMessage: string;
  updatedAt: string;
}
