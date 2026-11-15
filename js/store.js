class Store {
    constructor() {
        this.cart = [];
        this.wishlist = ['prod-1', 'prod-4'];
        this.activeView = 'products';
        this.selectedProduct = null;
        this.trackingOrder = null;
        this.promoCode = '';
        this.discountPercent = 0;
        this.listeners = [];
        this.loadFromStorage();
    }
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    notify() {
        this.saveToStorage();
        for (const listener of this.listeners) {
            listener();
        }
    }
    saveToStorage() {
        try {
            localStorage.setItem('ecom_cart', JSON.stringify(this.cart));
            localStorage.setItem('ecom_wishlist', JSON.stringify(this.wishlist));
        }
        catch {
            // LocalStorage fallback for sandboxed environments
        }
    }
    loadFromStorage() {
        try {
            const savedCart = localStorage.getItem('ecom_cart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
            }
            else {
                // Pre-populate with 1 sample item so user immediately sees a rich cart experience
                this.cart = [];
            }
            const savedWish = localStorage.getItem('ecom_wishlist');
            if (savedWish) {
                this.wishlist = JSON.parse(savedWish);
            }
        }
        catch {
            // Fallback
        }
    }
    // Cart operations
    addToCart(product, quantity = 1, color, size) {
        const existingIndex = this.cart.findIndex(item => item.product.id === product.id &&
            item.selectedColor === color &&
            item.selectedSize === size);
        if (existingIndex > -1) {
            this.cart[existingIndex].quantity += quantity;
        }
        else {
            this.cart.push({
                product,
                quantity,
                selectedColor: color || (product.colors ? product.colors[0] : undefined),
                selectedSize: size || (product.sizes ? product.sizes[0] : undefined)
            });
        }
        this.notify();
    }
    updateCartQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(index);
            return;
        }
        if (this.cart[index]) {
            this.cart[index].quantity = quantity;
            this.notify();
        }
    }
    removeFromCart(index) {
        if (this.cart[index]) {
            this.cart.splice(index, 1);
            this.notify();
        }
    }
    clearCart() {
        this.cart = [];
        this.promoCode = '';
        this.discountPercent = 0;
        this.notify();
    }
    applyPromo(code) {
        const clean = code.trim().toUpperCase();
        if (clean === 'SAVE20' || clean === 'WELCOME20') {
            this.promoCode = clean;
            this.discountPercent = 20;
            this.notify();
            return { success: true, message: '20% discount coupon applied successfully!' };
        }
        else if (clean === 'SUPER10') {
            this.promoCode = clean;
            this.discountPercent = 10;
            this.notify();
            return { success: true, message: '10% discount coupon applied successfully!' };
        }
        return { success: false, message: 'Invalid coupon code. Try SAVE20 or SUPER10' };
    }
    // Calculations
    getCartSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    }
    getCartDiscount() {
        const subtotal = this.getCartSubtotal();
        return (subtotal * this.discountPercent) / 100;
    }
    getCartTax() {
        const taxable = this.getCartSubtotal() - this.getCartDiscount();
        return Math.max(0, taxable * 0.08); // 8% mock tax
    }
    getCartShipping() {
        const subtotal = this.getCartSubtotal();
        if (subtotal === 0)
            return 0;
        return subtotal > 150 ? 0 : 15.00; // Free shipping over $150
    }
    getCartTotal() {
        return this.getCartSubtotal() - this.getCartDiscount() + this.getCartTax() + this.getCartShipping();
    }
    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }
    // Wishlist operations
    toggleWishlist(productId) {
        const exists = this.wishlist.includes(productId);
        if (exists) {
            this.wishlist = this.wishlist.filter(id => id !== productId);
        }
        else {
            this.wishlist.push(productId);
        }
        this.notify();
        return !exists;
    }
    isInWishlist(productId) {
        return this.wishlist.includes(productId);
    }
    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(id => id !== productId);
        this.notify();
    }
    clearWishlist() {
        this.wishlist = [];
        this.notify();
    }
    // Navigation state
    setView(view) {
        this.activeView = view;
        this.notify();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setSelectedProduct(product) {
        this.selectedProduct = product;
        this.notify();
    }
    setTrackingOrder(order) {
        this.trackingOrder = order;
        if (order) {
            this.activeView = 'tracking';
        }
        this.notify();
    }
}
export const store = new Store();
//# sourceMappingURL=store.js.map