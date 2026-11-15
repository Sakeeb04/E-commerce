import { Product, Order, UserProfile } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aura Studio Wireless Noise-Cancelling Headphones',
    brand: 'AcoustiQ',
    category: 'electronics',
    price: 249.99,
    originalPrice: 329.99,
    discountPercentage: 24,
    rating: 4.8,
    reviewCount: 342,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Immerse yourself in rich, high-resolution audio with industry-leading Active Noise Cancellation (ANC), 40-hour battery life, and ultra-plush memory foam earcups.',
    features: ['Active Noise Cancellation', '40-Hour Battery Life', 'Bluetooth 5.3', 'Fast USB-C Charging'],
    colors: ['Midnight Black', 'Platinum Silver', 'Deep Navy'],
    stock: 28,
    isNew: true,
    isTrending: true
  },
  {
    id: 'prod-2',
    name: 'Titan Horizon Smartwatch Pro (AMOLED GPS)',
    brand: 'Chronos',
    category: 'electronics',
    price: 189.00,
    originalPrice: 229.00,
    discountPercentage: 17,
    rating: 4.7,
    reviewCount: 215,
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
    description: 'Track workouts, heart health, SpO2, sleep stages, and GPS routes with the vivid 1.43” Always-On AMOLED screen encapsulated in an aerospace titanium chassis.',
    features: ['1.43" AMOLED Display', 'Dual-frequency GPS', '5 ATM Water Resistant', '14-Day Battery'],
    colors: ['Space Gray', 'Obsidian Black'],
    stock: 19,
    isTrending: true
  },
  {
    id: 'prod-3',
    name: 'Minimalist Artisan Leather Backpack',
    brand: 'UrbanCraft',
    category: 'fashion',
    price: 119.50,
    originalPrice: 159.00,
    discountPercentage: 25,
    rating: 4.9,
    reviewCount: 189,
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'],
    description: 'Handcrafted from full-grain vegetable-tanned leather, this minimalist backpack features a padded 15.6” laptop sleeve and ergonomic airflow padding.',
    features: ['Full-Grain Cowhide Leather', 'Padded 15.6" Laptop Sleeve', 'Anti-theft Rear Pocket'],
    colors: ['Vintage Tan', 'Espresso Brown', 'Matte Black'],
    sizes: ['18L Standard', '24L Travel'],
    stock: 14
  },
  {
    id: 'prod-4',
    name: 'Velocity Aero Lightweight Running Shoes',
    brand: 'StrideLab',
    category: 'fitness',
    price: 135.00,
    originalPrice: 160.00,
    discountPercentage: 15,
    rating: 4.6,
    reviewCount: 420,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'],
    description: 'Engineered for speed and effortless endurance. Supercritical midsole foam cushioning and breathable engineered mesh.',
    features: ['Energy-Return Supercritical Foam', 'Continental-Grip Rubber Outsole', 'Reflective Trim'],
    colors: ['Crimson Red', 'Volt Yellow'],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11'],
    stock: 35,
    isTrending: true
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ORD-98241',
    createdAt: '2026-11-08T10:15:00Z',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 1, selectedColor: 'Midnight Black' }
    ],
    subtotal: 249.99,
    discount: 25.00,
    tax: 18.00,
    shipping: 0,
    total: 242.99,
    status: 'out_for_delivery',
    shippingAddress: {
      fullName: 'Karthik Subramanian',
      street: '42, Anna Salai, Guindy Tech Park',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600032'
    },
    trackingNumber: 'TRK-IND-89240182',
    carrier: 'BlueDart Express',
    estimatedDelivery: 'Today by 6:00 PM',
    timeline: [
      {
        status: 'placed',
        title: 'Order Placed & Confirmed',
        description: 'Payment authorized successfully.',
        timestamp: 'Nov 08, 10:15 AM',
        completed: true,
        current: false
      },
      {
        status: 'confirmed',
        title: 'Packed & Processed',
        description: 'Eco-friendly sealed packaging prepared.',
        timestamp: 'Nov 09, 02:30 PM',
        completed: true,
        current: false
      },
      {
        status: 'shipped',
        title: 'In Transit via BlueDart Express',
        description: 'Departed central logistics hub (Chennai South).',
        timestamp: 'Nov 10, 08:45 AM',
        completed: true,
        current: false
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier agent en route: Vignesh Kumar (+91 94441 23456).',
        timestamp: 'Nov 12, 09:15 AM',
        completed: false,
        current: true
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Delivered to recipient.',
        timestamp: 'Estimated Nov 12, 06:00 PM',
        completed: false,
        current: false
      }
    ]
  }
];

export const MOCK_USER: UserProfile = {
  id: 'usr-8821',
  name: 'Karthik Subramanian',
  email: 'karthik.developer@example.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  tier: 'Gold',
  rewardPoints: 1450
};

