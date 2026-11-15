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
  thumbnail: string;
  images: string[];
  description: string;
  features: string[];
  colors?: string[];
  sizes?: string[];
  stock: number;
  isNew?: boolean;
  isTrending?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered';

export interface TimelineEvent {
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
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  timeline: TimelineEvent[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  tier: string;
  rewardPoints: number;
}

