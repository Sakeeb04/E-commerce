export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'electronics' | 'fashion' | 'home' | 'accessories' | 'fitness';
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  thumbnail: string;
  description: string;
  features: string[];
  colors?: string[];
  sizes?: string[];
  stock: number;
  isNew?: boolean;
  isTrending?: boolean;
  specs?: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentMethod {
  type: 'card' | 'upi' | 'cod';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  upiId?: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderTimelineEvent {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  estimatedDelivery: string;
  trackingNumber: string;
  carrier: string;
  timeline: OrderTimelineEvent[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: ShippingAddress[];
  defaultAddressIndex: number;
  memberSince: string;
  tier: 'Standard' | 'Silver' | 'Gold' | 'Platinum';
  rewardPoints: number;
}

export interface ProductFilters {
  category: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

