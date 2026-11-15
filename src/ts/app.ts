import { api } from './api.js';
import { store } from './store.js';
import { Product, ProductFilters, Order, ShippingAddress, PaymentMethod } from './types.js';

class AppController {
  private currentFilters: ProductFilters = {
    category: 'all',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 400,
    minRating: 0,
    sortBy: 'featured'
  };

  private products: Product[] = [];
  private isLoadingProducts = false;

  public async init(): Promise<void> {
    this.bindGlobalEvents();
    this.setupListeners();
    await this.loadProducts();
    this.render();
  }

  private setupListeners(): void {
    store.subscribe(() => {
      this.updateBadges();
      this.renderCurrentView();
    });
  }

  private async loadProducts(): Promise<void> {
    this.isLoadingProducts = true;
    this.renderProductGrid();
    try {
      const response = await api.getProducts(this.currentFilters);
      this.products = response.products;
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      this.isLoadingProducts = false;
      this.renderProductGrid();
    }
  }

  private bindGlobalEvents(): void {
    // Navigation clicks
    document.querySelectorAll('[data-navigate]').forEach(elem => {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = (e.currentTarget as HTMLElement).getAttribute('data-navigate') as any;
        if (targetView) {
          store.setView(targetView);
        }
      });
    });

    // Search inputs
    const searchInputs = document.querySelectorAll<HTMLInputElement>('.search-input');
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const val = (e.target as HTMLInputElement).value;
        this.currentFilters.searchQuery = val;
        this.debounce(() => this.loadProducts(), 300)();
      });
    });

    // Close modals on overlay click or escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModals();
      }
    });

    // Mobile nav toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileDrawer.classList.toggle('active');
      });
    }

    // Filter events (Price range, category chips, rating, sort)
    const categoryChips = document.querySelectorAll('.category-chip');
    categoryChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const cat = (e.currentTarget as HTMLElement).getAttribute('data-category') || 'all';
        categoryChips.forEach(c => c.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        this.currentFilters.category = cat;
        this.loadProducts();
      });
    });

    const sortSelect = document.getElementById('sortSelect') as HTMLSelectElement | null;
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentFilters.sortBy = (e.target as HTMLSelectElement).value as any;
        this.loadProducts();
      });
    }

    const priceSlider = document.getElementById('priceRange') as HTMLInputElement | null;
    const priceDisplay = document.getElementById('priceRangeDisplay');
    if (priceSlider && priceDisplay) {
      priceSlider.addEventListener('input', (e) => {
        const val = Number((e.target as HTMLInputElement).value);
        priceDisplay.textContent = `$${val}`;
        this.currentFilters.maxPrice = val;
        this.debounce(() => this.loadProducts(), 300)();
      });
    }
  }

  private debounceTimer: any = null;
  private debounce(func: () => void, delay: number) {
    return () => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(func, delay);
    };
  }

  public render(): void {
    this.updateBadges();
    this.renderCurrentView();
  }

  private updateBadges(): void {
    const cartCount = store.getCartCount();
    document.querySelectorAll('.cart-badge-count').forEach(badge => {
      badge.textContent = cartCount.toString();
      (badge as HTMLElement).style.display = cartCount > 0 ? 'inline-flex' : 'none';
    });

    const wishCount = store.wishlist.length;
    document.querySelectorAll('.wishlist-badge-count').forEach(badge => {
      badge.textContent = wishCount.toString();
      (badge as HTMLElement).style.display = wishCount > 0 ? 'inline-flex' : 'none';
    });

    const authLink = document.getElementById('navAuthLink');
    if (authLink) {
      authLink.textContent = store.isAuthenticated ? 'Account' : 'Sign In';
      authLink.setAttribute('data-navigate', store.isAuthenticated ? 'profile' : 'login');
    }
  }

  private renderCurrentView(): void {
    const views = ['products', 'cart', 'checkout', 'orders', 'profile', 'tracking', 'wishlist', 'login'];
    views.forEach(v => {
      const elem = document.getElementById(`view-${v}`);
      if (elem) {
        elem.classList.toggle('active-view', store.activeView === v);
      }
    });

    // Update active nav indicators
    document.querySelectorAll('[data-navigate]').forEach(nav => {
      const navView = nav.getAttribute('data-navigate');
      nav.classList.toggle('nav-link-active', navView === store.activeView);
    });

    // Render target view content
    switch (store.activeView) {
      case 'products':
        // Grid already loaded or loading
        break;
      case 'cart':
        this.renderCartView();
        break;
      case 'wishlist':
        this.renderWishlistView();
        break;
      case 'checkout':
        this.renderCheckoutView();
        break;
      case 'orders':
        this.renderOrdersView();
        break;
      case 'profile':
        this.renderProfileView();
        break;
      case 'tracking':
        this.renderTrackingView();
        break;
      case 'login':
        this.renderLoginView();
        break;
    }
  }

  // ==========================================
  // VIEW: PRODUCT LISTING & DETAILS
  // ==========================================
  private renderProductGrid(): void {
    const container = document.getElementById('productsGrid');
    if (!container) return;

    if (this.isLoadingProducts) {
      container.innerHTML = Array(6).fill(0).map(() => `
        <div class="product-skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-line" style="width: 40%"></div>
          <div class="skeleton-line" style="width: 80%"></div>
          <div class="skeleton-line" style="width: 60%"></div>
        </div>
      `).join('');
      return;
    }

    if (this.products.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fa-solid fa-box-open"></i></div>
          <h3>No matching products found</h3>
          <p>Try resetting filters or searching with different keywords.</p>
          <button class="btn btn-outline" id="resetFiltersBtn">Reset Filters</button>
        </div>
      `;
      document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
        this.currentFilters = {
          category: 'all',
          searchQuery: '',
          minPrice: 0,
          maxPrice: 400,
          minRating: 0,
          sortBy: 'featured'
        };
        const searchInput = document.getElementById('navSearchInput') as HTMLInputElement;
        if (searchInput) searchInput.value = '';
        this.loadProducts();
      });
      return;
    }

    container.innerHTML = this.products.map(p => {
      const isWish = store.isInWishlist(p.id);
      return `
        <div class="product-card" data-id="${p.id}">
          <div class="product-image-wrap">
            <img src="${p.thumbnail}" alt="${p.name}" loading="lazy" />
            <div class="card-badges">
              ${p.isNew ? '<span class="badge badge-new">New</span>' : ''}
              ${p.discountPercentage ? `<span class="badge badge-sale">-${p.discountPercentage}%</span>` : ''}
              ${p.isTrending ? '<span class="badge badge-trending">Trending</span>' : ''}
            </div>
            <button class="wishlist-btn ${isWish ? 'active' : ''}" data-wishlist-id="${p.id}" title="Wishlist">
              <i class="${isWish ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
            </button>
            <button class="quick-view-overlay-btn" data-quickview-id="${p.id}">
              <i class="fa-solid fa-eye"></i> Quick View
            </button>
          </div>
          <div class="product-info">
            <span class="product-brand">${p.brand}</span>
            <h3 class="product-title" data-quickview-id="${p.id}">${p.name}</h3>
            <div class="product-rating">
              <div class="stars">
                ${this.renderStars(p.rating)}
              </div>
              <span class="rating-text">${p.rating.toFixed(1)} (${p.reviewCount})</span>
            </div>
            <div class="product-price-row">
              <div class="price-wrap">
                <span class="current-price">$${p.price.toFixed(2)}</span>
                ${p.originalPrice ? `<span class="original-price">$${p.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              <button class="add-cart-btn" data-add-id="${p.id}" title="Add to Cart">
                <i class="fa-solid fa-bag-shopping"></i> Add
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners
    container.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = (e.currentTarget as HTMLElement).getAttribute('data-wishlist-id');
        if (id) {
          const added = store.toggleWishlist(id);
          this.showToast(added ? 'Added to your wishlist!' : 'Removed from wishlist');
          this.renderProductGrid();
        }
      });
    });

    container.querySelectorAll('[data-quickview-id]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = (e.currentTarget as HTMLElement).getAttribute('data-quickview-id');
        if (id) {
          const prod = await api.getProductById(id);
          if (prod) {
            this.openProductModal(prod);
          }
        }
      });
    });

    container.querySelectorAll('[data-add-id]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = (e.currentTarget as HTMLElement).getAttribute('data-add-id');
        if (id) {
          const prod = await api.getProductById(id);
          if (prod) {
            store.addToCart(prod, 1);
            this.showToast(`Added "${prod.name}" to cart! 🛍️`);
          }
        }
      });
    });
  }

  private renderStars(rating: number): string {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return `
      ${'<i class="fa-solid fa-star"></i>'.repeat(full)}
      ${half ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}
      ${'<i class="fa-regular fa-star"></i>'.repeat(empty)}
    `;
  }

  public openProductModal(product: Product): void {
    const modal = document.getElementById('productDetailModal');
    if (!modal) return;

    let selectedImageIndex = 0;
    let selectedColor = product.colors ? product.colors[0] : '';
    let selectedSize = product.sizes ? product.sizes[0] : '';
    let quantity = 1;

    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="product-modal-grid">
          <!-- Gallery -->
          <div class="modal-gallery">
            <div class="main-image-wrap">
              <img id="modalMainImage" src="${product.images[0]}" alt="${product.name}" />
            </div>
            <div class="gallery-thumbs">
              ${product.images.map((img, idx) => `
                <img src="${img}" class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-thumb-idx="${idx}" alt="Thumb ${idx + 1}" />
              `).join('')}
            </div>
          </div>

          <!-- Product Details -->
          <div class="modal-details">
            <div class="badge-row">
              <span class="badge badge-brand">${product.brand}</span>
              ${product.stock < 20 ? `<span class="badge badge-warning">Only ${product.stock} left in stock</span>` : `<span class="badge badge-in-stock">In Stock (${product.stock})</span>`}
            </div>
            <h2 class="modal-product-title">${product.name}</h2>
            <div class="product-rating">
              <div class="stars">${this.renderStars(product.rating)}</div>
              <span class="rating-text">${product.rating.toFixed(1)} (${product.reviewCount} verified reviews)</span>
            </div>

            <div class="modal-price-box">
              <div class="price-wrap">
                <span class="modal-current-price">$${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="modal-original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
              </div>
              ${product.discountPercentage ? `<span class="modal-savings-tag">Save ${product.discountPercentage}% off retail</span>` : ''}
            </div>

            <p class="modal-description">${product.description}</p>

            ${product.colors ? `
              <div class="variant-section">
                <label class="variant-label">Color: <strong id="selectedColorDisplay">${selectedColor}</strong></label>
                <div class="color-options">
                  ${product.colors.map((c, i) => `
                    <button class="color-pill ${i === 0 ? 'active' : ''}" data-color="${c}">${c}</button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${product.sizes ? `
              <div class="variant-section">
                <label class="variant-label">Size: <strong id="selectedSizeDisplay">${selectedSize}</strong></label>
                <div class="size-options">
                  ${product.sizes.map((s, i) => `
                    <button class="size-pill ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Quantity & Actions -->
            <div class="modal-actions-row">
              <div class="quantity-stepper">
                <button type="button" class="stepper-btn" id="modalQtyMinus"><i class="fa-solid fa-minus"></i></button>
                <span class="stepper-value" id="modalQtyVal">1</span>
                <button type="button" class="stepper-btn" id="modalQtyPlus"><i class="fa-solid fa-plus"></i></button>
              </div>
              <button class="btn btn-primary btn-large btn-add-modal" id="modalAddToCartBtn">
                <i class="fa-solid fa-bag-shopping"></i> Add to Cart • $${product.price.toFixed(2)}
              </button>
              <button class="btn btn-icon-round ${store.isInWishlist(product.id) ? 'active' : ''}" id="modalWishlistBtn">
                <i class="${store.isInWishlist(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
              </button>
            </div>

            <!-- Features & Specs -->
            <div class="modal-specs-accordion">
              <h4>Key Highlights</h4>
              <ul class="features-list">
                ${product.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('')}
              </ul>
              ${product.specs ? `
                <table class="specs-table">
                  ${Object.entries(product.specs).map(([key, val]) => `
                    <tr><th>${key}</th><td>${val}</td></tr>
                  `).join('')}
                </table>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      // Gallery thumb switching
      const mainImg = modalBody.querySelector('#modalMainImage') as HTMLImageElement;
      modalBody.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', (e) => {
          modalBody.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
          (e.currentTarget as HTMLElement).classList.add('active');
          const idx = Number((e.currentTarget as HTMLElement).getAttribute('data-thumb-idx'));
          if (mainImg && product.images[idx]) {
            mainImg.src = product.images[idx];
          }
        });
      });

      // Color selector
      modalBody.querySelectorAll('.color-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          modalBody.querySelectorAll('.color-pill').forEach(b => b.classList.remove('active'));
          (e.currentTarget as HTMLElement).classList.add('active');
          selectedColor = (e.currentTarget as HTMLElement).getAttribute('data-color') || '';
          const disp = modalBody.querySelector('#selectedColorDisplay');
          if (disp) disp.textContent = selectedColor;
        });
      });

      // Size selector
      modalBody.querySelectorAll('.size-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          modalBody.querySelectorAll('.size-pill').forEach(b => b.classList.remove('active'));
          (e.currentTarget as HTMLElement).classList.add('active');
          selectedSize = (e.currentTarget as HTMLElement).getAttribute('data-size') || '';
          const disp = modalBody.querySelector('#selectedSizeDisplay');
          if (disp) disp.textContent = selectedSize;
        });
      });

      // Quantity stepper
      const qtyVal = modalBody.querySelector('#modalQtyVal');
      const addBtn = modalBody.querySelector('#modalAddToCartBtn') as HTMLButtonElement;
      modalBody.querySelector('#modalQtyMinus')?.addEventListener('click', () => {
        if (quantity > 1) {
          quantity--;
          if (qtyVal) qtyVal.textContent = quantity.toString();
          if (addBtn) addBtn.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> Add to Cart • $${(product.price * quantity).toFixed(2)}`;
        }
      });
      modalBody.querySelector('#modalQtyPlus')?.addEventListener('click', () => {
        if (quantity < product.stock) {
          quantity++;
          if (qtyVal) qtyVal.textContent = quantity.toString();
          if (addBtn) addBtn.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> Add to Cart • $${(product.price * quantity).toFixed(2)}`;
        }
      });

      // Add to cart click
      addBtn?.addEventListener('click', () => {
        store.addToCart(product, quantity, selectedColor, selectedSize);
        this.showToast(`Added ${quantity}x "${product.name}" to cart! 🛍️`);
        this.closeModals();
      });

      // Wishlist toggle
      modalBody.querySelector('#modalWishlistBtn')?.addEventListener('click', (e) => {
        const added = store.toggleWishlist(product.id);
        (e.currentTarget as HTMLElement).classList.toggle('active', added);
        const icon = (e.currentTarget as HTMLElement).querySelector('i');
        if (icon) {
          icon.className = added ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
        }
        this.showToast(added ? 'Saved to wishlist!' : 'Removed from wishlist');
      });
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Close button
    modal.querySelector('.modal-close-btn')?.addEventListener('click', () => {
      this.closeModals();
    });
  }

  public closeModals(): void {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = 'auto';
  }

  // ==========================================
  // VIEW: WISHLIST SCREEN
  // ==========================================
  private async renderWishlistView(): Promise<void> {
    const container = document.getElementById('view-wishlist');
    if (!container) return;

    if (store.wishlist.length === 0) {
      container.innerHTML = `
        <div class="page-container wishlist-page">
          <div class="empty-state">
            <div class="empty-icon"><i class="fa-regular fa-heart" style="color: #ec4899;"></i></div>
            <h2>Your Wishlist is Empty</h2>
            <p>Save items you love by tapping the heart icon on any product card or details page.</p>
            <button class="btn btn-primary" onclick="window.app.navigateTo('products')">
              <i class="fa-solid fa-arrow-left"></i> Explore Products
            </button>
          </div>
        </div>
      `;
      return;
    }

    const { products } = await api.getProducts();
    const wishProducts = products.filter(p => store.isInWishlist(p.id));

    if (wishProducts.length === 0) {
      container.innerHTML = `
        <div class="page-container wishlist-page">
          <div class="empty-state">
            <div class="empty-icon"><i class="fa-regular fa-heart" style="color: #ec4899;"></i></div>
            <h2>Your Wishlist is Empty</h2>
            <p>Save items you love by tapping the heart icon on any product card or details page.</p>
            <button class="btn btn-primary" onclick="window.app.navigateTo('products')">
              <i class="fa-solid fa-arrow-left"></i> Explore Products
            </button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="page-container wishlist-page">
        <div class="page-header-row">
          <div>
            <h1 class="page-title"><i class="fa-solid fa-heart" style="color: #ec4899;"></i> My Wishlist (${wishProducts.length} items)</h1>
            <p class="page-subtitle">Your saved favorites — ready to move to cart anytime</p>
          </div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" id="addAllWishlistToCartBtn">
              <i class="fa-solid fa-bag-shopping"></i> Add All to Cart
            </button>
            <button class="btn btn-outline-danger btn-sm" id="clearWishlistBtn">
              <i class="fa-solid fa-trash-can"></i> Clear Wishlist
            </button>
          </div>
        </div>

        <div class="products-grid">
          ${wishProducts.map(p => `
            <div class="product-card" data-id="${p.id}">
              <div class="product-image-wrap">
                <img src="${p.thumbnail}" alt="${p.name}" loading="lazy" />
                <div class="card-badges">
                  ${p.isNew ? '<span class="badge badge-new">New</span>' : ''}
                  ${p.discountPercentage ? `<span class="badge badge-sale">-${p.discountPercentage}%</span>` : ''}
                </div>
                <button class="wishlist-btn active" data-wishlist-remove="${p.id}" title="Remove from Wishlist">
                  <i class="fa-solid fa-heart" style="color: #ec4899;"></i>
                </button>
                <button class="quick-view-overlay-btn" data-quickview-id="${p.id}">
                  <i class="fa-solid fa-eye"></i> Quick View
                </button>
              </div>
              <div class="product-info">
                <span class="product-brand">${p.brand}</span>
                <h3 class="product-title" data-quickview-id="${p.id}">${p.name}</h3>
                <div class="product-rating">
                  <div class="stars">${this.renderStars(p.rating)}</div>
                  <span class="rating-text">${p.rating.toFixed(1)} (${p.reviewCount})</span>
                </div>
                <div class="product-price-row">
                  <div class="price-wrap">
                    <span class="current-price">$${p.price.toFixed(2)}</span>
                    ${p.originalPrice ? `<span class="original-price">$${p.originalPrice.toFixed(2)}</span>` : ''}
                  </div>
                  <button class="add-cart-btn" data-wish-move-cart="${p.id}">
                    <i class="fa-solid fa-cart-plus"></i> Move to Cart
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('[data-wishlist-remove]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = (e.currentTarget as HTMLElement).getAttribute('data-wishlist-remove');
        if (id) {
          store.removeFromWishlist(id);
          this.showToast('Removed from wishlist');
          this.renderWishlistView();
        }
      });
    });

    container.querySelectorAll('[data-wish-move-cart]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = (e.currentTarget as HTMLElement).getAttribute('data-wish-move-cart');
        if (id) {
          const prod = await api.getProductById(id);
          if (prod) {
            store.addToCart(prod, 1);
            store.removeFromWishlist(id);
            this.showToast(`Moved "${prod.name}" to cart! 🛍️`);
            this.renderWishlistView();
          }
        }
      });
    });

    container.querySelectorAll('[data-quickview-id]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = (e.currentTarget as HTMLElement).getAttribute('data-quickview-id');
        if (id) {
          const prod = await api.getProductById(id);
          if (prod) {
            this.openProductModal(prod);
          }
        }
      });
    });

    document.getElementById('addAllWishlistToCartBtn')?.addEventListener('click', () => {
      wishProducts.forEach(p => store.addToCart(p, 1));
      this.showToast(`Added all ${wishProducts.length} wishlist items to your cart! 🛍️`);
      store.setView('cart');
    });

    document.getElementById('clearWishlistBtn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your wishlist?')) {
        store.clearWishlist();
        this.showToast('Wishlist cleared');
        this.renderWishlistView();
      }
    });
  }

  // ==========================================
  // VIEW: CART SCREEN
  // ==========================================
  private renderCartView(): void {
    const container = document.getElementById('view-cart');
    if (!container) return;

    if (store.cart.length === 0) {
      container.innerHTML = `
        <div class="page-container cart-page">
          <div class="empty-state">
            <div class="empty-icon"><i class="fa-solid fa-cart-shopping"></i></div>
            <h2>Your Shopping Cart is Empty</h2>
            <p>Looks like you haven't added anything yet. Explore our curated collections and discover great deals.</p>
            <button class="btn btn-primary" onclick="window.app.navigateTo('products')">
              <i class="fa-solid fa-arrow-left"></i> Explore Products
            </button>
          </div>
        </div>
      `;
      return;
    }

    const subtotal = store.getCartSubtotal();
    const discount = store.getCartDiscount();
    const tax = store.getCartTax();
    const shipping = store.getCartShipping();
    const total = store.getCartTotal();
    const freeShippingThreshold = 150;
    const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

    container.innerHTML = `
      <div class="page-container cart-page">
        <div class="page-header-row">
          <div>
            <h1 class="page-title">Shopping Cart (${store.getCartCount()} items)</h1>
            <p class="page-subtitle">Review items in your bag before proceeding to secure checkout</p>
          </div>
          <button class="btn btn-outline-danger btn-sm" id="clearCartBtn">
            <i class="fa-solid fa-trash-can"></i> Clear Cart
          </button>
        </div>

        <!-- Free shipping bar -->
        <div class="free-shipping-card">
          <div class="shipping-info-row">
            <span><i class="fa-solid fa-truck-fast"></i> ${subtotal >= freeShippingThreshold ? '<strong>Congratulations!</strong> You unlocked FREE Express Shipping!' : `Add <strong>$${(freeShippingThreshold - subtotal).toFixed(2)}</strong> more to get FREE Delivery!`}</span>
            <span>${progressToFreeShipping}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${progressToFreeShipping}%"></div>
          </div>
        </div>

        <div class="cart-layout-grid">
          <!-- Cart Items List -->
          <div class="cart-items-container">
            ${store.cart.map((item, index) => `
              <div class="cart-item-row" data-cart-index="${index}">
                <img src="${item.product.thumbnail}" alt="${item.product.name}" class="cart-item-img" />
                <div class="cart-item-info">
                  <div class="cart-item-title-row">
                    <h3 class="cart-item-title">${item.product.name}</h3>
                    <button class="cart-item-remove-btn" data-remove-index="${index}" title="Remove item">
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  <div class="cart-item-meta">
                    ${item.selectedColor ? `<span class="meta-tag">Color: <strong>${item.selectedColor}</strong></span>` : ''}
                    ${item.selectedSize ? `<span class="meta-tag">Size: <strong>${item.selectedSize}</strong></span>` : ''}
                    <span class="meta-tag">Unit Price: $${item.product.price.toFixed(2)}</span>
                  </div>
                  <div class="cart-item-bottom-row">
                    <div class="quantity-stepper small">
                      <button type="button" class="stepper-btn" data-qty-change="-1" data-index="${index}"><i class="fa-solid fa-minus"></i></button>
                      <span class="stepper-value">${item.quantity}</span>
                      <button type="button" class="stepper-btn" data-qty-change="1" data-index="${index}"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <div class="cart-item-total">
                      $${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Order Summary Sidebar -->
          <div class="cart-summary-sidebar">
            <div class="summary-card">
              <h2 class="summary-title">Order Summary</h2>

              <!-- Promo Code Box -->
              <div class="promo-box">
                <div class="promo-input-group">
                  <input type="text" id="promoInput" placeholder="Promo code (SAVE20, SUPER10)" value="${store.promoCode}" />
                  <button class="btn btn-dark btn-sm" id="applyPromoBtn">Apply</button>
                </div>
                ${store.promoCode ? `<div class="promo-applied-badge"><i class="fa-solid fa-circle-check"></i> Code <strong>${store.promoCode}</strong> applied (-${store.discountPercent}%)</div>` : ''}
              </div>

              <!-- Price Breakdown -->
              <div class="summary-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              ${discount > 0 ? `
                <div class="summary-row discount-row">
                  <span>Coupon Discount</span>
                  <span>-$${discount.toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="summary-row">
                <span>Estimated Sales Tax (8%)</span>
                <span>$${tax.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>${shipping === 0 ? '<strong class="text-success">FREE</strong>' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-total-row">
                <span>Total</span>
                <span class="total-amount">$${total.toFixed(2)}</span>
              </div>

              <button class="btn btn-primary btn-block btn-checkout" id="proceedCheckoutBtn">
                Proceed to Checkout <i class="fa-solid fa-arrow-right"></i>
              </button>

              <div class="trust-badges">
                <div><i class="fa-solid fa-shield-halved"></i> 256-bit Encrypted Checkout</div>
                <div><i class="fa-solid fa-rotate-left"></i> 30-Day Easy Returns</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Cart Events
    container.querySelectorAll('[data-remove-index]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number((e.currentTarget as HTMLElement).getAttribute('data-remove-index'));
        store.removeFromCart(idx);
        this.showToast('Item removed from cart');
      });
    });

    container.querySelectorAll('[data-qty-change]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const delta = Number((e.currentTarget as HTMLElement).getAttribute('data-qty-change'));
        const idx = Number((e.currentTarget as HTMLElement).getAttribute('data-index'));
        const currentQty = store.cart[idx].quantity;
        store.updateCartQuantity(idx, currentQty + delta);
      });
    });

    document.getElementById('clearCartBtn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to empty your cart?')) {
        store.clearCart();
        this.showToast('Cart cleared');
      }
    });

    document.getElementById('applyPromoBtn')?.addEventListener('click', () => {
      const input = document.getElementById('promoInput') as HTMLInputElement;
      if (input) {
        const res = store.applyPromo(input.value);
        this.showToast(res.message);
      }
    });

    document.getElementById('proceedCheckoutBtn')?.addEventListener('click', () => {
      store.setView('checkout');
    });
  }

  // ==========================================
  // VIEW: CHECKOUT SCREEN
  // ==========================================
  private async renderCheckoutView(): Promise<void> {
    const container = document.getElementById('view-checkout');
    if (!container) return;

    if (store.cart.length === 0) {
      store.setView('products');
      return;
    }

    const user = await api.getUserProfile();
    const subtotal = store.getCartSubtotal();
    const discount = store.getCartDiscount();
    const tax = store.getCartTax();
    const shipping = store.getCartShipping();
    const total = store.getCartTotal();

    container.innerHTML = `
      <div class="page-container checkout-page">
        <div class="checkout-header">
          <button class="back-link" onclick="window.app.navigateTo('cart')">
            <i class="fa-solid fa-arrow-left"></i> Back to Cart
          </button>
          <h1 class="page-title">Secure Checkout</h1>
        </div>

        <div class="checkout-layout-grid">
          <!-- Form Section -->
          <div class="checkout-form-container">
            <form id="checkoutForm" onsubmit="event.preventDefault();">
              <!-- Step 1: Shipping Address -->
              <div class="checkout-card">
                <div class="checkout-step-title">
                  <span class="step-badge">1</span>
                  <h3>Shipping Address</h3>
                </div>

                <div class="saved-address-selector">
                  ${user.addresses.map((addr, idx) => `
                    <label class="address-radio-card ${idx === 0 ? 'selected' : ''}">
                      <input type="radio" name="selectedAddress" value="${idx}" ${idx === 0 ? 'checked' : ''} />
                      <div class="address-content">
                        <strong>${addr.fullName}</strong>
                        <span>${addr.street}, ${addr.city}, ${addr.state} - ${addr.zipCode}</span>
                        <span>Phone: ${addr.phone}</span>
                      </div>
                    </label>
                  `).join('')}
                </div>

                <div class="form-grid">
                  <div class="form-group full-width">
                    <label>Full Name *</label>
                    <input type="text" id="shipName" class="form-input" value="${user.name}" required />
                  </div>
                  <div class="form-group full-width">
                    <label>Street Address *</label>
                    <input type="text" id="shipStreet" class="form-input" value="${user.addresses[0].street}" required />
                  </div>
                  <div class="form-group">
                    <label>City *</label>
                    <input type="text" id="shipCity" class="form-input" value="${user.addresses[0].city}" required />
                  </div>
                  <div class="form-group">
                    <label>State / Province *</label>
                    <input type="text" id="shipState" class="form-input" value="${user.addresses[0].state}" required />
                  </div>
                  <div class="form-group">
                    <label>Postal Code *</label>
                    <input type="text" id="shipZip" class="form-input" value="${user.addresses[0].zipCode}" required />
                  </div>
                  <div class="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" id="shipPhone" class="form-input" value="${user.phone}" required />
                  </div>
                </div>
              </div>

              <!-- Step 2: Payment Method -->
              <div class="checkout-card">
                <div class="checkout-step-title">
                  <span class="step-badge">2</span>
                  <h3>Payment Method</h3>
                </div>

                <div class="payment-tabs">
                  <label class="payment-method-card active" data-pay-type="card">
                    <input type="radio" name="paymentType" value="card" checked />
                    <i class="fa-solid fa-credit-card"></i>
                    <span>Credit / Debit Card</span>
                  </label>
                  <label class="payment-method-card" data-pay-type="upi">
                    <input type="radio" name="paymentType" value="upi" />
                    <i class="fa-solid fa-mobile-screen"></i>
                    <span>UPI / QR</span>
                  </label>
                  <label class="payment-method-card" data-pay-type="cod">
                    <input type="radio" name="paymentType" value="cod" />
                    <i class="fa-solid fa-money-bill-wave"></i>
                    <span>Cash on Delivery</span>
                  </label>
                </div>

                <!-- Card Details Panel -->
                <div id="cardPaymentPanel" class="payment-subpanel">
                  <div class="form-grid">
                    <div class="form-group full-width">
                      <label>Card Number</label>
                      <input type="text" class="form-input" placeholder="4532 •••• •••• 8821" value="4532 8921 7731 8821" />
                    </div>
                    <div class="form-group">
                      <label>Expiration Date</label>
                      <input type="text" class="form-input" placeholder="MM/YY" value="09/28" />
                    </div>
                    <div class="form-group">
                      <label>CVV / CVC</label>
                      <input type="password" maxlength="4" class="form-input" placeholder="•••" value="821" />
                    </div>
                  </div>
                </div>

                <!-- UPI Panel -->
                <div id="upiPaymentPanel" class="payment-subpanel" style="display: none;">
                  <div class="form-group full-width">
                    <label>Enter Virtual Payment Address (UPI ID)</label>
                    <input type="text" class="form-input" placeholder="username@okhdfcbank" value="karthik@okaxis" />
                    <small class="helper-text">Google Pay, PhonePe, Paytm, or BHIM supported</small>
                  </div>
                </div>

                <!-- COD Panel -->
                <div id="codPaymentPanel" class="payment-subpanel" style="display: none;">
                  <div class="alert-info-box">
                    <i class="fa-solid fa-circle-info"></i> You can pay in cash or via mobile QR code when the courier arrives at your doorstep.
                  </div>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-large" id="submitOrderBtn">
                <i class="fa-solid fa-lock"></i> Pay $${total.toFixed(2)} & Place Order
              </button>
            </form>
          </div>

          <!-- Checkout Order Review -->
          <div class="checkout-review-sidebar">
            <div class="summary-card">
              <h3 class="summary-title">Order Overview (${store.getCartCount()} items)</h3>
              <div class="review-items-list">
                ${store.cart.map(item => `
                  <div class="review-item-row">
                    <img src="${item.product.thumbnail}" alt="${item.product.name}" />
                    <div class="review-item-info">
                      <strong>${item.product.name}</strong>
                      <small>Qty: ${item.quantity} ${item.selectedColor ? `• ${item.selectedColor}` : ''}</small>
                    </div>
                    <span class="review-item-price">$${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                `).join('')}
              </div>

              <div class="summary-divider"></div>
              <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
              ${discount > 0 ? `<div class="summary-row discount-row"><span>Discount (${store.promoCode})</span><span>-$${discount.toFixed(2)}</span></div>` : ''}
              <div class="summary-row"><span>Tax (8%)</span><span>$${tax.toFixed(2)}</span></div>
              <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
              <div class="summary-divider"></div>
              <div class="summary-total-row"><span>Total Payable</span><span class="total-amount">$${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Toggle Payment Method tabs
    const payCards = container.querySelectorAll('.payment-method-card');
    const cardPanel = document.getElementById('cardPaymentPanel');
    const upiPanel = document.getElementById('upiPaymentPanel');
    const codPanel = document.getElementById('codPaymentPanel');

    payCards.forEach(card => {
      card.addEventListener('click', (e) => {
        payCards.forEach(c => c.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        const type = (e.currentTarget as HTMLElement).getAttribute('data-pay-type');
        if (cardPanel) cardPanel.style.display = type === 'card' ? 'block' : 'none';
        if (upiPanel) upiPanel.style.display = type === 'upi' ? 'block' : 'none';
        if (codPanel) codPanel.style.display = type === 'cod' ? 'block' : 'none';
      });
    });

    // Handle Order Submission
    const form = document.getElementById('checkoutForm');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitOrderBtn') as HTMLButtonElement;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Secure Payment...';
      }

      const activePayType = document.querySelector('input[name="paymentType"]:checked') as HTMLInputElement;
      const payment: PaymentMethod = {
        type: (activePayType ? activePayType.value : 'card') as any
      };

      const shippingAddress: ShippingAddress = {
        fullName: (document.getElementById('shipName') as HTMLInputElement).value,
        street: (document.getElementById('shipStreet') as HTMLInputElement).value,
        city: (document.getElementById('shipCity') as HTMLInputElement).value,
        state: (document.getElementById('shipState') as HTMLInputElement).value,
        zipCode: (document.getElementById('shipZip') as HTMLInputElement).value,
        country: 'India',
        phone: (document.getElementById('shipPhone') as HTMLInputElement).value
      };

      try {
        const order = await api.createOrder({
          items: [...store.cart],
          subtotal,
          discount,
          tax,
          shipping,
          total,
          shippingAddress,
          paymentMethod: payment,
          estimatedDelivery: '3 to 5 business days'
        });

        store.clearCart();
        this.openOrderSuccessModal(order);
      } catch (err) {
        alert('Order processing failed, please try again.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      }
    });
  }

  private openOrderSuccessModal(order: Order): void {
    const modal = document.getElementById('orderSuccessModal');
    if (!modal) return;

    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="order-success-content">
          <div class="success-checkmark-circle">
            <i class="fa-solid fa-check"></i>
          </div>
          <h2>Thank You! Order Confirmed!</h2>
          <p>We've received your order and have begun packing your items with care.</p>

          <div class="order-receipt-card">
            <div class="receipt-row"><span>Order Number:</span><strong>${order.orderNumber}</strong></div>
            <div class="receipt-row"><span>Tracking Number:</span><strong>${order.trackingNumber}</strong></div>
            <div class="receipt-row"><span>Carrier:</span><strong>${order.carrier}</strong></div>
            <div class="receipt-row"><span>Amount Paid:</span><strong>$${order.total.toFixed(2)}</strong></div>
            <div class="receipt-row"><span>Delivery Address:</span><span>${order.shippingAddress.street}, ${order.shippingAddress.city}</span></div>
          </div>

          <div class="modal-success-actions">
            <button class="btn btn-primary btn-large" id="trackOrderNowBtn">
              <i class="fa-solid fa-location-crosshairs"></i> Track Order Live
            </button>
            <button class="btn btn-outline" id="continueShoppingBtn">
              Continue Shopping
            </button>
          </div>
        </div>
      `;

      modalBody.querySelector('#trackOrderNowBtn')?.addEventListener('click', () => {
        this.closeModals();
        store.setTrackingOrder(order);
      });

      modalBody.querySelector('#continueShoppingBtn')?.addEventListener('click', () => {
        this.closeModals();
        store.setView('products');
      });
    }

    modal.classList.add('active');
  }

  // ==========================================
  // VIEW: ORDER TRACKING SCREEN
  // ==========================================
  private async renderTrackingView(): Promise<void> {
    const container = document.getElementById('view-tracking');
    if (!container) return;

    let order = store.trackingOrder;
    if (!order) {
      const orders = await api.getOrders();
      order = orders[0] || null;
      store.trackingOrder = order;
    }

    if (!order) {
      container.innerHTML = `
        <div class="page-container">
          <div class="empty-state">
            <div class="empty-icon"><i class="fa-solid fa-truck"></i></div>
            <h2>No Active Shipment to Track</h2>
            <p>You can track any previous purchase from your Order History.</p>
            <button class="btn btn-primary" onclick="window.app.navigateTo('orders')">View Orders</button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="page-container tracking-page">
        <div class="tracking-top-bar">
          <button class="back-link" onclick="window.app.navigateTo('orders')">
            <i class="fa-solid fa-arrow-left"></i> All Orders
          </button>
          <span class="live-pill"><span class="pulsing-dot"></span> LIVE SHIPMENT STATUS</span>
        </div>

        <!-- Tracking Header Card -->
        <div class="tracking-status-banner">
          <div class="status-banner-left">
            <span class="order-badge status-${order.status}">${order.status.replace(/_/g, ' ').toUpperCase()}</span>
            <h1>Estimated Delivery: ${order.estimatedDelivery}</h1>
            <p class="tracking-subtitle">Carrier: <strong>${order.carrier}</strong> | Waybill: <strong>${order.trackingNumber}</strong></p>
          </div>
          <div class="status-banner-right">
            <button class="btn btn-outline-light btn-sm" id="refreshTrackingBtn">
              <i class="fa-solid fa-arrows-rotate"></i> Refresh Status
            </button>
          </div>
        </div>

        <div class="tracking-layout-grid">
          <!-- Timeline Card -->
          <div class="tracking-timeline-card">
            <h2>Order Progress Timeline</h2>
            <div class="timeline-stepper">
              ${order.timeline.map((step, idx) => `
                <div class="timeline-step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}">
                  <div class="step-indicator">
                    <div class="step-icon">
                      ${step.completed ? '<i class="fa-solid fa-check"></i>' : (step.current ? '<i class="fa-solid fa-truck-fast"></i>' : idx + 1)}
                    </div>
                    ${idx < order!.timeline.length - 1 ? '<div class="step-line"></div>' : ''}
                  </div>
                  <div class="step-details">
                    <div class="step-header">
                      <h3>${step.title}</h3>
                      <span class="step-time">${step.timestamp}</span>
                    </div>
                    <p class="step-desc">${step.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Package Details & Map Simulator -->
          <div class="tracking-sidebar">
            <!-- Simulated Map Card -->
            <div class="tracking-map-card">
              <div class="mock-map-visual">
                <div class="map-pulse-circle"></div>
                <div class="map-vehicle-icon"><i class="fa-solid fa-truck-moving"></i></div>
                <div class="map-pin-icon"><i class="fa-solid fa-location-dot"></i></div>
              </div>
              <div class="map-info">
                <h4>Delivery Address</h4>
                <p>${order.shippingAddress.fullName}</p>
                <p>${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
              </div>
            </div>

            <!-- Items In Package -->
            <div class="tracking-items-card">
              <h3>Package Contents (${order.items.length} items)</h3>
              <div class="tracking-items-list">
                ${order.items.map(item => `
                  <div class="package-item-row">
                    <img src="${item.product.thumbnail}" alt="${item.product.name}" />
                    <div class="package-item-details">
                      <strong>${item.product.name}</strong>
                      <small>Qty: ${item.quantity} ${item.selectedColor ? `• ${item.selectedColor}` : ''}</small>
                      <span class="package-price">$${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('refreshTrackingBtn')?.addEventListener('click', () => {
      this.showToast('Updated live GPS shipment coordinates! 🛰️');
    });
  }

  // ==========================================
  // VIEW: USER ORDERS & HISTORY
  // ==========================================
  private async renderOrdersView(): Promise<void> {
    const container = document.getElementById('view-orders');
    if (!container) return;

    const orders = await api.getOrders();

    container.innerHTML = `
      <div class="page-container orders-page">
        <div class="page-header-row">
          <div>
            <h1 class="page-title">My Orders (${orders.length})</h1>
            <p class="page-subtitle">Track, return, or reorder previous purchases</p>
          </div>
        </div>

        <div class="orders-list">
          ${orders.map(order => `
            <div class="order-card">
              <div class="order-card-header">
                <div class="order-header-col">
                  <span class="label">ORDER PLACED</span>
                  <strong>${new Date(order.createdAt).toLocaleDateString()}</strong>
                </div>
                <div class="order-header-col">
                  <span class="label">TOTAL</span>
                  <strong>$${order.total.toFixed(2)}</strong>
                </div>
                <div class="order-header-col">
                  <span class="label">SHIP TO</span>
                  <strong>${order.shippingAddress.fullName}</strong>
                </div>
                <div class="order-header-col status-col">
                  <span class="order-badge status-${order.status}">${order.status.replace(/_/g, ' ').toUpperCase()}</span>
                  <small># ${order.orderNumber}</small>
                </div>
              </div>

              <div class="order-card-body">
                <div class="order-items-sublist">
                  ${order.items.map(item => `
                    <div class="order-subitem">
                      <img src="${item.product.thumbnail}" alt="${item.product.name}" />
                      <div class="subitem-meta">
                        <h4>${item.product.name}</h4>
                        <p>Quantity: ${item.quantity} • Unit Price: $${item.product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
                <div class="order-actions">
                  <button class="btn btn-primary btn-sm" data-track-id="${order.id}">
                    <i class="fa-solid fa-location-crosshairs"></i> Track Shipment
                  </button>
                  <button class="btn btn-outline btn-sm" data-reorder-id="${order.id}">
                    <i class="fa-solid fa-rotate-right"></i> Buy Again
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('[data-track-id]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-track-id');
        if (id) {
          const ord = await api.getOrderById(id);
          if (ord) store.setTrackingOrder(ord);
        }
      });
    });

    container.querySelectorAll('[data-reorder-id]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-reorder-id');
        if (id) {
          const ord = await api.getOrderById(id);
          if (ord) {
            ord.items.forEach(it => store.addToCart(it.product, it.quantity, it.selectedColor, it.selectedSize));
            this.showToast('Items added back to your cart!');
            store.setView('cart');
          }
        }
      });
    });
  }

  // ==========================================
  // VIEW: USER PROFILE & DASHBOARD
  // ==========================================
  private async renderProfileView(): Promise<void> {
    const container = document.getElementById('view-profile');
    if (!container) return;

    const user = await api.getUserProfile();
    const orders = await api.getOrders();

    container.innerHTML = `
      <div class="page-container dashboard-page">
        <!-- Dashboard Top Profile Header -->
        <div class="dashboard-hero-card">
          <div class="user-avatar-wrap">
            <img src="${user.avatar}" alt="${user.name}" class="user-avatar-img" />
            <span class="user-tier-pill ${user.tier.toLowerCase()}">${user.tier} Member</span>
          </div>
          <div class="user-meta-info">
            <h2>${user.name}</h2>
            <p><i class="fa-regular fa-envelope"></i> ${user.email} &nbsp;•&nbsp; <i class="fa-solid fa-phone"></i> ${user.phone}</p>
            <p><i class="fa-regular fa-calendar-check"></i> Member Since ${user.memberSince}</p>
          </div>
          <div class="reward-points-card">
            <div class="points-num">${user.rewardPoints}</div>
            <div class="points-label"><i class="fa-solid fa-coins"></i> Reward Points Available</div>
          </div>
        </div>

        <!-- Dashboard Stats Grid -->
        <div class="stats-counter-grid">
          <div class="stat-card">
            <div class="stat-icon bg-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <div class="stat-data">
              <span class="stat-val">${orders.length}</span>
              <span class="stat-lbl">Lifetime Orders</span>
            </div>
          </div>
          <div class="stat-card" style="cursor: pointer;" onclick="window.app.navigateTo('wishlist')">
            <div class="stat-icon bg-pink">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div class="stat-data">
              <span class="stat-val">${store.wishlist.length}</span>
              <span class="stat-lbl">Wishlist Items (View)</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon bg-emerald">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="stat-data">
              <span class="stat-val">${user.addresses.length}</span>
              <span class="stat-lbl">Saved Addresses</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon bg-purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div class="stat-data">
              <span class="stat-val">Active</span>
              <span class="stat-lbl">Account Security</span>
            </div>
          </div>
        </div>

        <div class="dashboard-columns-grid">
          <!-- Profile Settings Form -->
          <div class="dashboard-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="margin-bottom: 0;"><i class="fa-solid fa-user-gear"></i> Personal Information</h3>
              <button type="button" class="btn btn-outline btn-sm" id="resetProfileBtn" title="Reset to original default data">
                <i class="fa-solid fa-rotate-left"></i> Reset Defaults
              </button>
            </div>
            <form id="profileForm" onsubmit="event.preventDefault();">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="profName" class="form-input" value="${user.name}" required />
              </div>
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="profEmail" class="form-input" value="${user.email}" required />
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input type="tel" id="profPhone" class="form-input" value="${user.phone}" required />
              </div>

              <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px dashed var(--border-color);">
                <label style="font-size: 0.88rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; display: block;">
                  <i class="fa-solid fa-house"></i> Default Delivery Address
                </label>
                <div class="form-group" style="margin-bottom: 0.6rem;">
                  <label>Street Address</label>
                  <input type="text" id="profStreet" class="form-input" value="${user.addresses[0]?.street || ''}" required />
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.6rem;">
                  <div class="form-group">
                    <label>City</label>
                    <input type="text" id="profCity" class="form-input" value="${user.addresses[0]?.city || ''}" required />
                  </div>
                  <div class="form-group">
                    <label>State</label>
                    <input type="text" id="profState" class="form-input" value="${user.addresses[0]?.state || ''}" required />
                  </div>
                  <div class="form-group">
                    <label>ZIP Code</label>
                    <input type="text" id="profZip" class="form-input" value="${user.addresses[0]?.zipCode || ''}" required />
                  </div>
                </div>
              </div>

              <div style="margin-top: 1.25rem; display: flex; align-items: center; gap: 0.75rem;">
                <button type="submit" class="btn btn-primary btn-sm">
                  <i class="fa-solid fa-floppy-disk"></i> Save Profile Changes
                </button>
                <small style="color: var(--text-muted);">Changes persist permanently after refresh</small>
              </div>
            </form>
          </div>

          <!-- Saved Delivery Addresses -->
          <div class="dashboard-card">
            <h3><i class="fa-solid fa-map-location-dot"></i> Saved Addresses</h3>
            <div class="saved-addresses-list">
              ${user.addresses.map((addr, idx) => `
                <div class="address-item-card">
                  <div class="addr-header">
                    <strong>Address #${idx + 1}</strong>
                    ${idx === 0 ? '<span class="default-badge">Default</span>' : ''}
                  </div>
                  <p><strong>${addr.fullName}</strong></p>
                  <p>${addr.street}, ${addr.city}, ${addr.state} - ${addr.zipCode}</p>
                  <p>Mobile: ${addr.phone}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('profileForm')?.addEventListener('submit', async () => {
      const name = (document.getElementById('profName') as HTMLInputElement).value;
      const email = (document.getElementById('profEmail') as HTMLInputElement).value;
      const phone = (document.getElementById('profPhone') as HTMLInputElement).value;
      const street = (document.getElementById('profStreet') as HTMLInputElement).value;
      const city = (document.getElementById('profCity') as HTMLInputElement).value;
      const state = (document.getElementById('profState') as HTMLInputElement).value;
      const zipCode = (document.getElementById('profZip') as HTMLInputElement).value;

      const updatedAddresses = [
        {
          fullName: name,
          street,
          city,
          state,
          zipCode,
          country: 'India',
          phone
        },
        ...(user.addresses.slice(1))
      ];

      await api.updateUserProfile({
        name,
        email,
        phone,
        addresses: updatedAddresses
      });

      this.showToast('Profile saved permanently! Refreshing page will keep this data. ✅');
      this.renderProfileView();
    });

    document.getElementById('resetProfileBtn')?.addEventListener('click', async () => {
      if (confirm('Reset profile back to original demo values?')) {
        await api.resetUserProfile();
        this.showToast('Profile reset to default data.');
        this.renderProfileView();
      }
    });
  }

  // ==========================================
  // VIEW: LOGIN & REGISTER AUTHENTICATION
  // ==========================================
  private async renderLoginView(): Promise<void> {
    const container = document.getElementById('view-login');
    if (!container) return;

    const user = await api.getUserProfile();

    if (store.isAuthenticated) {
      container.innerHTML = `
        <div class="auth-page-container">
          <div class="auth-card authenticated-session-box">
            <img src="${user.avatar}" alt="${user.name}" class="auth-avatar-circle" />
            <h2 class="auth-title">Welcome, ${user.name}!</h2>
            <p class="auth-subtitle" style="margin-bottom: 1.5rem;">You are currently signed in as <strong>${user.email}</strong></p>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <button class="btn btn-primary" onclick="window.app.navigateTo('profile')">
                <i class="fa-solid fa-user-gear"></i> View Account Dashboard
              </button>
              <button class="btn btn-outline" onclick="window.app.navigateTo('products')">
                <i class="fa-solid fa-bag-shopping"></i> Continue Shopping
              </button>
              <button class="btn btn-outline-danger btn-sm" id="authSignOutBtn" style="margin-top: 0.5rem;">
                <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign Out
              </button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('authSignOutBtn')?.addEventListener('click', () => {
        store.logout();
        this.showToast('You have been signed out successfully.');
        this.renderLoginView();
      });
      return;
    }

    container.innerHTML = `
      <div class="auth-page-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="auth-logo-badge">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h1 class="auth-title" id="authFormTitle">Welcome Back</h1>
            <p class="auth-subtitle" id="authFormSubtitle">Sign in to access your orders, wishlist, and exclusive discounts</p>
          </div>

          <!-- Auth Mode Tabs -->
          <div class="auth-tabs">
            <button type="button" class="auth-tab-btn active" id="tabSignInBtn">Sign In</button>
            <button type="button" class="auth-tab-btn" id="tabSignUpBtn">Create Account</button>
          </div>

          <!-- SIGN IN FORM -->
          <form id="signInForm" class="auth-form" onsubmit="event.preventDefault();">
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" id="loginEmail" class="form-input" placeholder="name@example.com" value="karthik.developer@example.com" required />
            </div>

            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <label>Password</label>
                <a href="#" style="font-size: 0.78rem; color: var(--primary);" id="forgotPassLink">Forgot password?</a>
              </div>
              <input type="password" id="loginPassword" class="form-input" placeholder="••••••••" value="password123" required />
            </div>

            <div class="auth-options-row">
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                <input type="checkbox" checked /> Remember this device
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-large" id="loginSubmitBtn">
              Sign In <i class="fa-solid fa-arrow-right"></i>
            </button>
          </form>

          <!-- SIGN UP FORM (Hidden initially) -->
          <form id="signUpForm" class="auth-form" style="display: none;" onsubmit="event.preventDefault();">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" id="regName" class="form-input" placeholder="e.g. Karthik Subramanian" required />
            </div>

            <div class="form-group">
              <label>Email Address</label>
              <input type="email" id="regEmail" class="form-input" placeholder="name@example.com" required />
            </div>

            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" id="regPhone" class="form-input" placeholder="+91 98765 43210" required />
            </div>

            <div class="form-group">
              <label>Create Password</label>
              <input type="password" id="regPassword" class="form-input" placeholder="At least 8 characters" required />
            </div>

            <div class="auth-options-row">
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.8rem;">
                <input type="checkbox" required checked /> I agree to the <a href="#">Terms of Service</a> & <a href="#">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-large" id="regSubmitBtn">
              Create Account <i class="fa-solid fa-user-plus"></i>
            </button>
          </form>

          <div class="auth-divider">
            <span>Or continue with</span>
          </div>

          <div class="social-btns-group">
            <button type="button" class="btn btn-outline btn-sm" id="googleLoginBtn">
              <i class="fa-brands fa-google" style="color: #ea4335;"></i> Google
            </button>
            <button type="button" class="btn btn-outline btn-sm" id="appleLoginBtn">
              <i class="fa-brands fa-apple"></i> Apple
            </button>
          </div>

          <!-- Quick One-Click Demo Login Box -->
          <div class="demo-login-card">
            <p><i class="fa-solid fa-bolt-lightning"></i> Fast Testing / Demo Access</p>
            <button type="button" class="btn btn-primary btn-sm btn-block" id="oneClickDemoLoginBtn">
              One-Click Demo Sign In
            </button>
          </div>
        </div>
      </div>
    `;

    // Tab switcher events
    const tabSignIn = document.getElementById('tabSignInBtn');
    const tabSignUp = document.getElementById('tabSignUpBtn');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const title = document.getElementById('authFormTitle');
    const subtitle = document.getElementById('authFormSubtitle');

    tabSignIn?.addEventListener('click', () => {
      tabSignIn.classList.add('active');
      tabSignUp?.classList.remove('active');
      if (signInForm) signInForm.style.display = 'flex';
      if (signUpForm) signUpForm.style.display = 'none';
      if (title) title.textContent = 'Welcome Back';
      if (subtitle) subtitle.textContent = 'Sign in to access your orders, wishlist, and exclusive discounts';
    });

    tabSignUp?.addEventListener('click', () => {
      tabSignUp.classList.add('active');
      tabSignIn?.classList.remove('active');
      if (signUpForm) signUpForm.style.display = 'flex';
      if (signInForm) signInForm.style.display = 'none';
      if (title) title.textContent = 'Create an Account';
      if (subtitle) subtitle.textContent = 'Join LuminaShop today and get 20% off your first purchase!';
    });

    // Sign in submit
    signInForm?.addEventListener('submit', () => {
      const email = (document.getElementById('loginEmail') as HTMLInputElement).value;
      store.login();
      this.showToast(`Welcome back, ${email.split('@')[0]}! 🎉`);
      store.setView('profile');
    });

    // Sign up submit
    signUpForm?.addEventListener('submit', async () => {
      const name = (document.getElementById('regName') as HTMLInputElement).value;
      const email = (document.getElementById('regEmail') as HTMLInputElement).value;
      const phone = (document.getElementById('regPhone') as HTMLInputElement).value;

      await api.updateUserProfile({
        name,
        email,
        phone,
        addresses: [
          {
            fullName: name,
            street: '123 Tech Park Avenue',
            city: 'Chennai',
            state: 'Tamil Nadu',
            zipCode: '600001',
            country: 'India',
            phone
          }
        ]
      });

      store.login();
      this.showToast(`Account created successfully! Welcome, ${name}! 🎉`);
      store.setView('profile');
    });

    // One-click demo login
    document.getElementById('oneClickDemoLoginBtn')?.addEventListener('click', () => {
      store.login();
      this.showToast('Signed in with Demo Account! ✨');
      store.setView('profile');
    });

    // Social buttons
    document.getElementById('googleLoginBtn')?.addEventListener('click', () => {
      store.login();
      this.showToast('Signed in via Google! 🚀');
      store.setView('profile');
    });

    document.getElementById('appleLoginBtn')?.addEventListener('click', () => {
      store.login();
      this.showToast('Signed in via Apple ID! 🍎');
      store.setView('profile');
    });

    document.getElementById('forgotPassLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Password reset link has been dispatched to your email address.');
    });
  }

  // ==========================================
  // UTILITIES & FEEDBACK
  // ==========================================
  public showToast(message: string): void {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout((toast as any).timeoutId);
    (toast as any).timeoutId = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

// Global exposure for inline HTML handlers
(window as any).app = {
  controller: new AppController(),
  navigateTo: (view: 'products' | 'cart' | 'checkout' | 'orders' | 'profile' | 'tracking' | 'wishlist' | 'login') => {
    store.setView(view);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  (window as any).app.controller.init();
});

