import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Product, CartItem, Order, UserProfile } from './src/types';
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_USER } from './src/services/api';
import { colors } from './src/theme/colors';

import { ProductListScreen } from './src/screens/ProductListScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { WishlistScreen } from './src/screens/WishlistScreen';
import { CartScreen } from './src/screens/CartScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { OrderTrackingScreen } from './src/screens/OrderTrackingScreen';
import { ProfileDashboardScreen } from './src/screens/ProfileDashboardScreen';
import { LoginScreen } from './src/screens/LoginScreen';

type Tab = 'catalog' | 'wishlist' | 'cart' | 'tracking' | 'profile';

interface OrderPlacedPayload {
  orderNumber: string;
  total: number;
  carrier: string;
  trackingNumber: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('catalog');
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-4']);
  const [cart, setCart] = useState<CartItem[]>([
    { product: MOCK_PRODUCTS[0], quantity: 1, selectedColor: 'Midnight Black' }
  ]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order>(MOCK_ORDERS[0]);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1, color?: string, size?: string): void => {
    setCart((prev: CartItem[]): CartItem[] => {
      const idx = prev.findIndex((item: CartItem) => item.product.id === product.id && item.selectedColor === color);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += quantity;
        return next;
      }
      return [...prev, {
        product,
        quantity,
        selectedColor: color || (product.colors ? product.colors[0] : undefined),
        selectedSize: size || (product.sizes ? product.sizes[0] : undefined)
      }];
    });
    setSelectedProduct(null);
  };

  const handleUpdateQuantity = (index: number, quantity: number): void => {
    if (quantity <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCart((prev: CartItem[]): CartItem[] => {
      const next = [...prev];
      next[index].quantity = quantity;
      return next;
    });
  };

  const handleRemoveItem = (index: number): void => {
    setCart((prev: CartItem[]): CartItem[] => prev.filter((_: CartItem, i: number) => i !== index));
  };

  // Wishlist Handlers
  const handleToggleWishlist = (productId: string): void => {
    setWishlist((prev: string[]): string[] => {
      if (prev.includes(productId)) {
        return prev.filter((id: string) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const handleRemoveFromWishlist = (productId: string): void => {
    setWishlist((prev: string[]): string[] => prev.filter((id: string) => id !== productId));
  };

  const handleMoveWishlistToCart = (product: Product): void => {
    handleAddToCart(product, 1);
    handleRemoveFromWishlist(product.id);
  };

  const handleOrderPlaced = (orderInfo: OrderPlacedPayload): void => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderInfo.orderNumber,
      createdAt: new Date().toISOString(),
      items: [...cart],
      subtotal: orderInfo.total * 0.9,
      discount: 0,
      tax: orderInfo.total * 0.08,
      shipping: 0,
      total: orderInfo.total,
      status: 'placed',
      shippingAddress: {
        fullName: 'Karthik Subramanian',
        street: '42, Anna Salai, Guindy Tech Park',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipCode: '600032'
      },
      trackingNumber: orderInfo.trackingNumber,
      carrier: orderInfo.carrier,
      estimatedDelivery: '3 to 5 business days',
      timeline: [
        {
          status: 'placed',
          title: 'Order Placed Successfully',
          description: 'Payment authorized and verified.',
          timestamp: 'Just now',
          completed: true,
          current: true
        },
        {
          status: 'confirmed',
          title: 'Preparing Package',
          description: 'Items ready for dispatch.',
          timestamp: 'Pending',
          completed: false,
          current: false
        }
      ]
    };

    setOrders((prev: Order[]): Order[] => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
    setCart([]);
    setIsCheckingOut(false);
    setActiveTab('tracking');
  };

  const cartCount: number = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
  const wishlistCount: number = wishlist.length;
  const wishlistProducts: Product[] = products.filter((p: Product) => wishlist.includes(p.id));

  // Render Screen Content
  const renderContent = () => {
    if (selectedProduct) {
      return (
        <ProductDetailScreen
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      );
    }

    if (isCheckingOut) {
      return (
        <CheckoutScreen
          cart={cart}
          onBack={() => setIsCheckingOut(false)}
          onOrderPlaced={handleOrderPlaced}
        />
      );
    }

    switch (activeTab) {
      case 'catalog':
        return (
          <ProductListScreen
            products={products}
            onSelectProduct={(p: Product) => setSelectedProduct(p)}
            onAddToCart={(p: Product) => handleAddToCart(p, 1)}
          />
        );
      case 'wishlist':
        return (
          <WishlistScreen
            wishlistProducts={wishlistProducts}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onMoveToCart={handleMoveWishlistToCart}
            onSelectProduct={(p: Product) => setSelectedProduct(p)}
            onExploreProducts={() => setActiveTab('catalog')}
          />
        );
      case 'cart':
        return (
          <CartScreen
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onProceedCheckout={() => setIsCheckingOut(true)}
          />
        );
      case 'tracking':
        return (
          <OrderTrackingScreen
            order={selectedOrder}
            onBack={() => setActiveTab('profile')}
          />
        );
      case 'profile':
        return (
          <ProfileDashboardScreen
            user={user}
            orders={orders}
            onSelectOrder={(ord: Order) => {
              setSelectedOrder(ord);
              setActiveTab('tracking');
            }}
            onUpdateUser={(updated: Partial<UserProfile>) => {
              setUser((prev: UserProfile) => ({ ...prev, ...updated }));
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen View */}
      <View style={styles.screenArea}>
        {renderContent()}
      </View>

      {/* Bottom Navigation Tab Bar */}
      {!selectedProduct && !isCheckingOut && (
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('catalog')}
          >
            <Text style={[styles.navIcon, activeTab === 'catalog' && styles.navTextActive]}>🛍️</Text>
            <Text style={[styles.navText, activeTab === 'catalog' && styles.navTextActive]}>Shop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('wishlist')}
          >
            <View>
              <Text style={[styles.navIcon, activeTab === 'wishlist' && styles.navTextActive]}>❤️</Text>
              {wishlistCount > 0 && (
                <View style={styles.badgePink}>
                  <Text style={styles.badgeText}>{wishlistCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.navText, activeTab === 'wishlist' && styles.navTextActive]}>Wishlist</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('cart')}
          >
            <View>
              <Text style={[styles.navIcon, activeTab === 'cart' && styles.navTextActive]}>🛒</Text>
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.navText, activeTab === 'cart' && styles.navTextActive]}>Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('tracking')}
          >
            <Text style={[styles.navIcon, activeTab === 'tracking' && styles.navTextActive]}>📍</Text>
            <Text style={[styles.navText, activeTab === 'tracking' && styles.navTextActive]}>Track</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab('profile')}
          >
            <Text style={[styles.navIcon, activeTab === 'profile' && styles.navTextActive]}>👤</Text>
            <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.background
  },
  screenArea: {
    flex: 1
  },
  bottomNav: {
    height: 60,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  navIcon: {
    fontSize: 18
  },
  navText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 2
  },
  navTextActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.accent,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  badgePink: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EC4899',
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800'
  }
});
