import { Product, Order, UserProfile } from './types.js';

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
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Immerse yourself in rich, high-resolution audio with industry-leading Active Noise Cancellation (ANC), 40-hour battery life, and ultra-plush memory foam earcups designed for all-day comfort.',
    features: [
      'Hybrid Active Noise Cancellation with Transparency Mode',
      'Custom 40mm Dynamic Neodymium Drivers',
      'Up to 40 hours playtime on a single charge',
      'Fast USB-C charging: 10 mins gives 4 hours',
      'Multipoint Bluetooth 5.3 connection'
    ],
    colors: ['Midnight Black', 'Platinum Silver', 'Deep Navy'],
    stock: 28,
    isNew: true,
    isTrending: true,
    specs: {
      'Battery Life': '40 Hours (ANC on)',
      'Connectivity': 'Bluetooth 5.3, 3.5mm AUX',
      'Weight': '254 grams',
      'Microphone': 'Quad Beamforming with AI ENC'
    }
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
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Track workouts, heart health, SpO2, sleep stages, and GPS routes with the vivid 1.43” Always-On AMOLED screen encapsulated in an aerospace titanium alloy chassis.',
    features: [
      '1.43" Ultra-Bright AMOLED display (1000 nits)',
      'Dual-frequency GPS with offline breadcrumb trail',
      '100+ Sports Modes with automatic workout detection',
      '5 ATM Water Resistant (Swim proof)',
      '14-day extended battery life'
    ],
    colors: ['Space Gray', 'Obsidian Black', 'Desert Sand'],
    stock: 19,
    isTrending: true,
    specs: {
      'Display': '1.43" AMOLED 466x466',
      'Water Resistance': '50 Meters (5 ATM)',
      'Sensors': 'Optical Heart Rate, SpO2, Barometer',
      'Compatibility': 'iOS & Android'
    }
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
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Handcrafted from full-grain vegetable-tanned leather, this minimalist backpack features a padded 15.6” laptop compartment, waterproof zippers, and ergonomic airflow back padding.',
    features: [
      'Genuine full-grain cowhide leather',
      'Dedicated padded 15.6” laptop sleeve',
      'Hidden anti-theft passport pocket on back panel',
      'Water-repellent protective canvas interior lining',
      'Reinforced brass hardware and YKK metal zippers'
    ],
    colors: ['Vintage Tan', 'Espresso Brown', 'Matte Black'],
    sizes: ['18L Standard', '24L Travel'],
    stock: 14,
    isNew: false,
    specs: {
      'Capacity': '18 Liters',
      'Laptop Fit': 'Up to 15.6 inch MacBook/PC',
      'Dimensions': '42 x 30 x 14 cm',
      'Weight': '1.1 kg'
    }
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
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Engineered for speed and effortless endurance. Featuring responsive carbon-infused foam cushioning and breathable engineered mesh to keep your feet cool across marathon distances.',
    features: [
      'Energy-return supercritical midsole foam',
      'Breathable seamless engineered jacquard mesh',
      'Continental-grip rubber outsole for wet and dry roads',
      'Reflective elements for low-light night running'
    ],
    colors: ['Crimson Red', 'Volt Yellow', 'Electric Blue'],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    stock: 35,
    isTrending: true,
    specs: {
      'Drop': '8 mm',
      'Arch Support': 'Neutral',
      'Weight': '210g (Size 9)'
    }
  },
  {
    id: 'prod-5',
    name: 'Lumina Smart Ambient Desk Lamp',
    brand: 'Nordic Glow',
    category: 'home',
    price: 74.99,
    originalPrice: 99.00,
    discountPercentage: 24,
    rating: 4.7,
    reviewCount: 98,
    thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Elevate your workspace ambiance. Features stepless touch dimming, circadian rhythm color temperature auto-adjustment (2700K - 6500K), and built-in 15W Qi wireless fast charger.',
    features: [
      'Stepless brightness and color temperature adjustment',
      'Integrated 15W Qi Wireless Fast Charging base',
      'Anti-glare eye-care optical diffuser lens',
      'Smart app control & voice assistant compatibility'
    ],
    colors: ['Anodized Silver', 'Matte White', 'Dark Graphite'],
    stock: 42,
    isNew: true,
    specs: {
      'Color Temperature': '2700K - 6500K',
      'Luminous Flux': '800 Lumens',
      'Power Input': 'USB-C 24W Power Delivery'
    }
  },
  {
    id: 'prod-6',
    name: 'PurePour Precision Gooseneck Electric Kettle',
    brand: 'BrewMaster',
    category: 'home',
    price: 89.99,
    originalPrice: 110.00,
    discountPercentage: 18,
    rating: 4.8,
    reviewCount: 167,
    thumbnail: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'The pour-over perfectionist tool. Precision flow spout, LCD digital temperature control down to 1-degree increments, and a 60-minute temperature hold function.',
    features: [
      'Precise temperature control from 40°C to 100°C',
      'Ergonomic counterbalanced cool-touch grip',
      'Food-grade 304 Stainless Steel interior without plastics',
      'Rapid 1200W heating element'
    ],
    colors: ['Matte Black', 'Brushed Copper'],
    stock: 22,
    specs: {
      'Capacity': '0.9 Liter',
      'Power': '1200 Watts',
      'Voltage': '110-240V'
    }
  },
  {
    id: 'prod-7',
    name: 'OpticVue Polarized UV400 Sunglasses',
    brand: 'Solstice',
    category: 'accessories',
    price: 59.00,
    originalPrice: 85.00,
    discountPercentage: 30,
    rating: 4.5,
    reviewCount: 142,
    thumbnail: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Classic timeless frame equipped with triacetate cellulose polarized lenses that eliminate glare while safeguarding eyes against 100% of UVA/UVB rays.',
    features: [
      'UV400 Category 3 Polarization',
      'Lightweight durable acetate frame with flex hinges',
      'Scratch-resistant oleophobic coating',
      'Includes premium leather case and microfiber cloth'
    ],
    colors: ['Tortoise Brown', 'Classic Black', 'Crystal Smoke'],
    stock: 50,
    isTrending: false,
    specs: {
      'Lens Width': '52 mm',
      'Bridge Width': '20 mm',
      'Arm Length': '145 mm'
    }
  },
  {
    id: 'prod-8',
    name: 'FlexCore Resistance & Suspension Trainer Set',
    brand: 'AeroFit',
    category: 'fitness',
    price: 49.99,
    originalPrice: 69.99,
    discountPercentage: 28,
    rating: 4.9,
    reviewCount: 310,
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Transform any room or door into a full-body functional gym. High-tensile military-grade nylon straps tested up to 700 lbs with comfortable non-slip rubber handles.',
    features: [
      'Industrial-strength aircraft aluminum locking carabiners',
      'Heavy-duty door anchor and extension strap included',
      'Access to companion interactive mobile workout videos',
      'Compact breathable mesh carry bag'
    ],
    colors: ['Tactical Olive', 'Neon Volt', 'Stealth Black'],
    stock: 65,
    isNew: true,
    specs: {
      'Max User Weight': '700 lbs / 318 kg',
      'Material': 'Military-spec Nylon Webbing'
    }
  }
];

export const MOCK_USER: UserProfile = {
  id: 'usr-8821',
  name: 'Karthik Subramanian',
  email: 'karthik.developer@example.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  tier: 'Gold',
  rewardPoints: 1450,
  memberSince: 'March 2024',
  defaultAddressIndex: 0,
  addresses: [
    {
      fullName: 'Karthik Subramanian',
      street: '42, Anna Salai, Guindy Tech Park',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600032',
      country: 'India',
      phone: '+91 98765 43210'
    },
    {
      fullName: 'Karthik Subramanian',
      street: '15, 4th Cross Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560038',
      country: 'India',
      phone: '+91 98765 43210'
    }
  ]
};

export const MOCK_INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ORD-98241',
    createdAt: '2026-11-08T10:15:00Z',
    items: [
      {
        product: MOCK_PRODUCTS[0],
        quantity: 1,
        selectedColor: 'Midnight Black'
      },
      {
        product: MOCK_PRODUCTS[6],
        quantity: 1,
        selectedColor: 'Classic Black'
      }
    ],
    subtotal: 308.99,
    discount: 30.00,
    tax: 25.10,
    shipping: 0,
    total: 304.09,
    status: 'out_for_delivery',
    shippingAddress: MOCK_USER.addresses[0],
    paymentMethod: { type: 'card', cardNumber: '•••• •••• •••• 4242' },
    estimatedDelivery: 'Today by 6:00 PM',
    trackingNumber: 'TRK-IND-89240182',
    carrier: 'BlueDart Express',
    timeline: [
      {
        status: 'placed',
        title: 'Order Placed & Confirmed',
        description: 'Payment verified and order accepted by merchant.',
        timestamp: 'Nov 08, 10:15 AM',
        completed: true,
        current: false
      },
      {
        status: 'confirmed',
        title: 'Packed & Processed',
        description: 'Items safely packed in eco-friendly protective packaging.',
        timestamp: 'Nov 09, 02:30 PM',
        completed: true,
        current: false
      },
      {
        status: 'shipped',
        title: 'In Transit via BlueDart Express',
        description: 'Departed regional logistics sorting hub (Chennai South).',
        timestamp: 'Nov 10, 08:45 AM',
        completed: true,
        current: false
      },
      {
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier executive assigned: Vignesh Kumar (+91 94441 23456).',
        timestamp: 'Nov 12, 09:15 AM',
        completed: false,
        current: true
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Package handed over to recipient.',
        timestamp: 'Estimated Nov 12, 06:00 PM',
        completed: false,
        current: false
      }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'ORD-76290',
    createdAt: '2026-10-24T14:20:00Z',
    items: [
      {
        product: MOCK_PRODUCTS[2],
        quantity: 1,
        selectedColor: 'Vintage Tan',
        selectedSize: '18L Standard'
      }
    ],
    subtotal: 119.50,
    discount: 0,
    tax: 10.75,
    shipping: 0,
    total: 130.25,
    status: 'delivered',
    shippingAddress: MOCK_USER.addresses[0],
    paymentMethod: { type: 'upi', upiId: 'karthik@okaxis' },
    estimatedDelivery: 'Oct 28, 2026',
    trackingNumber: 'TRK-IND-67319022',
    carrier: 'Delhivery Surface',
    timeline: [
      {
        status: 'placed',
        title: 'Order Placed',
        description: 'Payment successful.',
        timestamp: 'Oct 24, 02:20 PM',
        completed: true,
        current: false
      },
      {
        status: 'confirmed',
        title: 'Processed',
        description: 'Quality inspected.',
        timestamp: 'Oct 25, 11:00 AM',
        completed: true,
        current: false
      },
      {
        status: 'shipped',
        title: 'Shipped',
        description: 'Dispatched from Bangalore fulfillment facility.',
        timestamp: 'Oct 26, 04:00 PM',
        completed: true,
        current: false
      },
      {
        status: 'delivered',
        title: 'Delivered Successfully',
        description: 'Signed by recipient at door.',
        timestamp: 'Oct 28, 01:15 PM',
        completed: true,
        current: true
      }
    ]
  }
];

