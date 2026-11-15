import { Product, ProductFilters, Order, UserProfile } from './types.js';
/**
 * Mock API Service simulating backend endpoints with realistic network delays & error handling.
 */
declare class ApiService {
    private products;
    private orders;
    private user;
    constructor();
    private loadPersistedData;
    private saveUserData;
    private saveOrdersData;
    private delay;
    getProducts(filters?: Partial<ProductFilters>): Promise<{
        products: Product[];
        total: number;
    }>;
    getProductById(id: string): Promise<Product | null>;
    getUserProfile(): Promise<UserProfile>;
    updateUserProfile(updated: Partial<UserProfile>): Promise<UserProfile>;
    resetUserProfile(): Promise<UserProfile>;
    getOrders(): Promise<Order[]>;
    getOrderById(id: string): Promise<Order | null>;
    createOrder(orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber' | 'carrier' | 'timeline' | 'status'>): Promise<Order>;
}
export declare const api: ApiService;
export {};
