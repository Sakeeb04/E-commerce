import { CartItem, Product, Order, UserProfile } from './types.js';

type StateListener = () => void;

class Store {
  public cart: CartItem[] = [];
  public wishlist: string[] = ['prod-1', 'prod-4'];
  public activeView: 'products' | 'cart' | 'checkout' | 'orders' | 'profile' | 'tracking' | 'wishlist' | 'login' = 'products';
  public selectedProduct: Product | null = null;
  public trackingOrder: Order | null = null;
  public promoCode: string = '';
  public discountPercent: number = 0;
  public isAuthenticated: boolean = true;
  
  private listeners: StateListener[] = [];

  constructor() {
    this.loadFromStorage();
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.saveToStorage();
    for (const listener of this.listeners) {
      listener();
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('ecom_cart', JSON.stringify(this.cart));
      localStorage.setItem('ecom_wishlist', JSON.stringify(this.wishlist));
      localStorage.setItem('ecom_auth', this.isAuthenticated ? 'true' : 'false');
    } catch {
      // LocalStorage fallback for sandboxed environments
    }
  }

  private loadFromStorage(): void {
    try {
      const savedCart = localStorage.getItem('ecom_cart');
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
      } else {
        // Pre-populate with 1 sample item so user immediately sees a rich cart experience
        this.cart = [];
      }
      const savedWish = localStorage.getItem('ecom_wishlist');
      if (savedWish) {
        this.wishlist = JSON.parse(savedWish);
      }
      const savedAuth = localStorage.getItem('ecom_auth');
      if (savedAuth !== null) {
        this.isAuthenticated = savedAuth === 'true';
      }
    } catch {
      // Fallback
    }
  }

  // Cart operations
  public addToCart(product: Product, quantity = 1, color?: string, size?: string): void {
    const existingIndex = this.cart.findIndex(
      item => item.product.id === product.id &&
              item.selectedColor === color &&
              item.selectedSize === size
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        product,
        quantity,
        selectedColor: color || (product.colors ? product.colors[0] : undefined),
        selectedSize: size || (product.sizes ? product.sizes[0] : undefined)
      });
    }

    this.notify();
  }

  public updateCartQuantity(index: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(index);
      return;
    }
    if (this.cart[index]) {
      this.cart[index].quantity = quantity;
      this.notify();
    }
  }

  public removeFromCart(index: number): void {
    if (this.cart[index]) {
      this.cart.splice(index, 1);
      this.notify();
    }
  }

  public clearCart(): void {
    this.cart = [];
    this.promoCode = '';
    this.discountPercent = 0;
    this.notify();
  }

  public applyPromo(code: string): { success: boolean; message: string } {
    const clean = code.trim().toUpperCase();
    if (clean === 'SAVE20' || clean === 'WELCOME20') {
      this.promoCode = clean;
      this.discountPercent = 20;
      this.notify();
      return { success: true, message: '20% discount coupon applied successfully!' };
    } else if (clean === 'SUPER10') {
      this.promoCode = clean;
      this.discountPercent = 10;
      this.notify();
      return { success: true, message: '10% discount coupon applied successfully!' };
    }
    return { success: false, message: 'Invalid coupon code. Try SAVE20 or SUPER10' };
  }

  // Calculations
  public getCartSubtotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  public getCartDiscount(): number {
    const subtotal = this.getCartSubtotal();
    return (subtotal * this.discountPercent) / 100;
  }

  public getCartTax(): number {
    const taxable = this.getCartSubtotal() - this.getCartDiscount();
    return Math.max(0, taxable * 0.08); // 8% mock tax
  }

  public getCartShipping(): number {
    const subtotal = this.getCartSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 150 ? 0 : 15.00; // Free shipping over $150
  }

  public getCartTotal(): number {
    return this.getCartSubtotal() - this.getCartDiscount() + this.getCartTax() + this.getCartShipping();
  }

  public getCartCount(): number {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Wishlist operations
  public toggleWishlist(productId: string): boolean {
    const exists = this.wishlist.includes(productId);
    if (exists) {
      this.wishlist = this.wishlist.filter(id => id !== productId);
    } else {
      this.wishlist.push(productId);
    }
    this.notify();
    return !exists;
  }

  public isInWishlist(productId: string): boolean {
    return this.wishlist.includes(productId);
  }

  public removeFromWishlist(productId: string): void {
    this.wishlist = this.wishlist.filter(id => id !== productId);
    this.notify();
  }

  public clearWishlist(): void {
    this.wishlist = [];
    this.notify();
  }

  // Auth methods
  public login(): void {
    this.isAuthenticated = true;
    this.notify();
  }

  public logout(): void {
    this.isAuthenticated = false;
    this.notify();
  }

  // Navigation state
  public setView(view: 'products' | 'cart' | 'checkout' | 'orders' | 'profile' | 'tracking' | 'wishlist' | 'login'): void {
    this.activeView = view;
    this.notify();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public setSelectedProduct(product: Product | null): void {
    this.selectedProduct = product;
    this.notify();
  }

  public setTrackingOrder(order: Order | null): void {
    this.trackingOrder = order;
    if (order) {
      this.activeView = 'tracking';
    }
    this.notify();
  }
}

export const store = new Store();

