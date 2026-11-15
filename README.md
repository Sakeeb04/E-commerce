# 🛒 LuminaCommerce - Modern & Responsive E-Commerce (Web & Mobile UI)

A full-featured, responsive, production-ready E-Commerce UI built for both **Web** (HTML5, Modern CSS3, TypeScript / ES2020 JavaScript) and **Mobile** (React Native / Expo with TypeScript).

---

## 🌟 Project Highlights & Deliverables

| Deliverable | Features Included |
| :--- | :--- |
| **📱 Responsive Web UI & Mobile-Friendly** | Fluid Flexbox & Grid layouts, Glassmorphism, CSS variables, mobile floating bottom bar, touch targets |
| **🛍️ Product Listing & Details** | Category chips, instant search bar, price slider, sort by price/rating/newest, Quick-View modal with image switcher, variant selectors, specs & verified reviews |
| **🛒 Cart & Checkout Screens** | Live quantity counters, promo coupon validation (`SAVE20`, `SUPER10`), free shipping progress bar, 3-step checkout with address selection & payment method switching (Card, UPI, COD) |
| **📦 Order Tracking Screen** | Real-time interactive timeline stepper, estimated delivery counter, courier waybill number, mock GPS tracking visualization |
| **👤 User Profile & Dashboard** | Reward points balance, membership tier badge, saved delivery addresses manager, lifetime stats counter, order history with reorder actions |
| **🔌 API Service Layer** | RESTful mock API service (`ApiService`) simulating network latency, product filtering, profile mutations, and order creation |
| **📲 React Native Mobile App** | Dedicated `mobile/` app with full TypeScript components (`ProductListScreen`, `ProductDetailScreen`, `CartScreen`, `CheckoutScreen`, `OrderTrackingScreen`, `ProfileDashboardScreen`) |

---

## 📁 Project Architecture & File Structure

```text
E-commerce/
├── index.html                 # Main responsive Web UI with all screens seamlessly switchable
├── css/
│   ├── style.css              # Main design tokens, variables, typography, navigation bar, hero banner
│   └── components.css         # Product cards, modals, checkout forms, tracking stepper, toasts
├── src/
│   └── ts/
│       ├── types.ts           # Strict TypeScript interfaces (Product, Cart, Order, User, etc.)
│       ├── mockData.ts        # Comprehensive mock dataset with Unsplash HD assets
│       ├── api.ts             # Simulated REST API service layer with network latency
│       ├── store.ts           # Reactive state management (Cart, Wishlist, Navigation)
│       └── app.ts             # Web UI Controller (Event listeners, rendering, DOM updates)
├── js/                        # Compiled browser-ready JavaScript (from TypeScript)
│   ├── app.js
│   ├── api.js
│   ├── store.js
│   ├── mockData.js
│   └── types.js
├── mobile/                    # React Native / Expo Mobile App (TypeScript)
│   ├── package.json
│   ├── tsconfig.json
│   ├── App.tsx                # Main App entry with bottom navigation tabs
│   └── src/
│       ├── types/index.ts
│       ├── theme/colors.ts
│       ├── services/api.ts
│       └── screens/
│           ├── ProductListScreen.tsx
│           ├── ProductDetailScreen.tsx
│           ├── CartScreen.tsx
│           ├── CheckoutScreen.tsx
│           ├── OrderTrackingScreen.tsx
│           └── ProfileDashboardScreen.tsx
├── tsconfig.json              # Web TypeScript configuration
├── package.json               # Build & dev server scripts
└── README.md                  # Documentation & usage guide
```

---

## 🚀 How to Run the Web Application

### Option 1: Direct Browser Launch
Simply open `index.html` in your web browser (Google Chrome, Microsoft Edge, Firefox, Safari):
- Double click [index.html](file:///c:/Users/HP/OneDrive/Desktop/E-commerce/index.html) in your file explorer.

### Option 2: Run with Local HTTP Server
Run with any standard Node.js server:
```powershell
# Open terminal in project root
npx serve .
# or
npx http-server .
```
Then visit `http://localhost:3000` or the port shown.

### Option 3: Recompile TypeScript (when making code changes)
```powershell
npm run build:ts
```

---

## 📱 How to Run the React Native Mobile Application

The `mobile/` directory contains a dedicated React Native / Expo application:

```powershell
cd mobile
npm install
npx expo start
```
- Press `w` to run directly on the web browser.
- Press `a` to run on an Android emulator.
- Scan the QR code with the **Expo Go** mobile app on iOS or Android to test on a physical phone.

---

## 💡 தமிழ் விளக்கம் (Tamil Summary)

இந்த E-commerce செயலியில் நீங்கள் கேட்ட அனைத்து தேவைகளும் முழுமையாக உருவாக்கப்பட்டுள்ளன:
1. **HTML5, CSS3, TypeScript & JavaScript** கொண்டு நவீன web responsive UI உருவாக்கப்பட்டுள்ளது.
2. **Product Listing & Details**: பொருட்கள் பட்டியல், தேடல் (Search), வடிகட்டுதல் (Filters), Quick View மற்றும் Image Gallery.
3. **Shopping Cart & Checkout**: கார்ட்டில் பொருட்களைச் சேர்த்தல்/நீக்குதல், கூப்பன் கோடு (`SAVE20`), முகவரி தேர்வு மற்றும் Card/UPI/COD கட்டண முறைகள்.
4. **Order Tracking**: ஆர்டரை நேரலையாகக் கண்காணிக்கும் ஸ்டெப்-பை-ஸ்டெப் டைம்லைன் (Placed ➔ Confirmed ➔ Shipped ➔ Out for Delivery ➔ Delivered).
5. **User Profile & Dashboard**: வாடிக்கையாளர் விவரங்கள், ரிவார்டு புள்ளிகள் (Reward Points), பழைய ஆர்டர் வரலாறு.
6. **React Native Mobile App**: மொபைல் போன்களுக்கான பிரத்யேக React Native (TypeScript) ஆப் `mobile/` ஃபோல்டரில் முழு screen components-களுடன் அமைக்கப்பட்டுள்ளது.

