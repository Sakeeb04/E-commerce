import { Product, ProductFilters, Order, UserProfile, CartItem } from './types.js';
import { MOCK_PRODUCTS, MOCK_USER, MOCK_INITIAL_ORDERS } from './mockData.js';

/**
 * Mock API Service simulating backend endpoints with realistic network delays & error handling.
 */
class ApiService {
  private products: Product[] = [...MOCK_PRODUCTS];
  private orders: Order[] = [...MOCK_INITIAL_ORDERS];
  private user: UserProfile = { ...MOCK_USER };

  constructor() {
    this.loadPersistedData();
  }

  private loadPersistedData(): void {
    try {
      const savedUser = localStorage.getItem('ecom_user_profile');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
      const savedOrders = localStorage.getItem('ecom_orders_history');
      if (savedOrders) {
        this.orders = JSON.parse(savedOrders);
      }
    } catch {
      // LocalStorage fallback for environments without storage access
    }
  }

  private saveUserData(): void {
    try {
      localStorage.setItem('ecom_user_profile', JSON.stringify(this.user));
    } catch {
      // Fallback
    }
  }

  private saveOrdersData(): void {
    try {
      localStorage.setItem('ecom_orders_history', JSON.stringify(this.orders));
    } catch {
      // Fallback
    }
  }

  private delay<T>(data: T, ms = 250): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(data), ms));
  }

  // GET /api/products
  public async getProducts(filters?: Partial<ProductFilters>): Promise<{ products: Product[]; total: number }> {
    let result = [...this.products];

    if (filters) {
      if (filters.category && filters.category !== 'all') {
        result = result.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
      }

      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        result = result.filter(p => 
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }

      if (filters.minPrice !== undefined) {
        result = result.filter(p => p.price >= filters.minPrice!);
      }

      if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
        result = result.filter(p => p.price <= filters.maxPrice!);
      }

      if (filters.minRating !== undefined && filters.minRating > 0) {
        result = result.filter(p => p.rating >= filters.minRating!);
      }

      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-asc':
            result.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            result.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            result.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            break;
          case 'featured':
          default:
            result.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
            break;
        }
      }
    }

    return this.delay({ products: result, total: result.length }, 300);
  }

  // GET /api/products/:id
  public async getProductById(id: string): Promise<Product | null> {
    const product = this.products.find(p => p.id === id) || null;
    return this.delay(product, 200);
  }

  // GET /api/user
  public async getUserProfile(): Promise<UserProfile> {
    return this.delay({ ...this.user }, 200);
  }

  // PUT /api/user
  public async updateUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
    this.user = { ...this.user, ...updated };
    this.saveUserData();
    return this.delay({ ...this.user }, 300);
  }

  // Reset user profile to demo defaults
  public async resetUserProfile(): Promise<UserProfile> {
    this.user = { ...MOCK_USER };
    this.saveUserData();
    return this.delay({ ...this.user }, 200);
  }

  // GET /api/orders
  public async getOrders(): Promise<Order[]> {
    return this.delay([...this.orders], 300);
  }

  // GET /api/orders/:id
  public async getOrderById(id: string): Promise<Order | null> {
    const order = this.orders.find(o => o.id === id || o.orderNumber === id) || null;
    return this.delay(order, 250);
  }

  // POST /api/checkout
  public async createOrder(orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber' | 'carrier' | 'timeline' | 'status'>): Promise<Order> {
    const orderId = `ord-${Date.now().toString().slice(-4)}`;
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const trackingSuffix = Math.floor(10000000 + Math.random() * 90000000);

    const newOrder: Order = {
      ...orderPayload,
      id: orderId,
      orderNumber: `ORD-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      status: 'placed',
      trackingNumber: `TRK-IND-${trackingSuffix}`,
      carrier: 'BlueDart Express',
      timeline: [
        {
          status: 'placed',
          title: 'Order Placed & Confirmed',
          description: 'Payment verified and order accepted by merchant.',
          timestamp: 'Just now',
          completed: true,
          current: true
        },
        {
          status: 'confirmed',
          title: 'Processing Order',
          description: 'Inventory allocated and preparing for packaging.',
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          status: 'shipped',
          title: 'Dispatched to Courier',
          description: 'Package ready to depart regional logistics center.',
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          status: 'out_for_delivery',
          title: 'Out for Delivery',
          description: 'Courier agent will arrive at your destination address.',
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          status: 'delivered',
          title: 'Delivered',
          description: 'Package delivered to recipient.',
          timestamp: 'Pending',
          completed: false,
          current: false
        }
      ]
    };

    this.orders.unshift(newOrder);
    this.saveOrdersData();
    return this.delay(newOrder, 600);
  }
}

export const api = new ApiService();

