

import type { Product, Order, Coupon, Announcement, UserWishlistItem, SupportTicket, CouponUsage } from './types';

export const initialProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Cyber-Tee',
    description: 'A stylish t-shirt for the modern tech enthusiast. Made from 100% organic cotton, this tee is both comfortable and durable.',
    category: 'Apparel',
    promotion: 'New Arrival',
    variants: [
      { id: 'var_1_1', color: 'black', size: 'M', stock: 15, price: 29.99, imageUrl: 'https://picsum.photos/600/600?random=1' },
      { id: 'var_1_2', color: 'black', size: 'L', stock: 8, price: 29.99, imageUrl: 'https://picsum.photos/600/600?random=1' },
      { id: 'var_1_3', color: 'white', size: 'M', stock: 20, price: 29.99, imageUrl: 'https://picsum.photos/600/600?random=2' },
      { id: 'var_1_4', color: 'white', size: 'XL', stock: 0, price: 29.99, imageUrl: 'https://picsum.photos/600/600?random=2' },
    ],
    comments: [
        { id: 'comment_1', author: 'TechGuru', rating: 5, text: 'Best shirt ever! So comfy.', date: '2024-07-15' }
    ]
  },
  {
    id: 'prod_2',
    name: 'Nova Hoodie',
    description: 'Stay warm and stylish with the Nova Hoodie. Features a fleece lining and a minimalist design.',
    category: 'Apparel',
    variants: [
      { id: 'var_2_1', color: 'navy', size: 'S', stock: 12, price: 59.99, imageUrl: 'https://picsum.photos/600/600?random=3' },
      { id: 'var_2_2', color: 'navy', size: 'M', stock: 3, price: 59.99, imageUrl: 'https://picsum.photos/600/600?random=3' },
      { id: 'var_2_3', color: 'gray', size: 'L', stock: 9, price: 59.99, imageUrl: 'https://picsum.photos/600/600?random=4' },
    ],
    comments: []
  },
  {
    id: 'prod_3',
    name: 'Quantum Cap',
    description: 'A sleek and modern cap to complete your look. Adjustable strap for a perfect fit.',
    category: 'Accessories',
    promotion: 'On Sale',
    variants: [
      { id: 'var_3_1', color: 'black', size: 'one size', stock: 30, price: 24.99, imageUrl: 'https://picsum.photos/600/600?random=5' },
      { id: 'var_3_2', color: 'blue', size: 'one size', stock: 18, price: 24.99, imageUrl: 'https://picsum.photos/600/600?random=6' },
    ],
    comments: [
        { id: 'comment_2', author: 'StyleMaven', rating: 4, text: 'Looks great, fits well.', date: '2024-07-16' },
        { id: 'comment_3', author: 'CapCollector', rating: 5, text: 'My new favorite cap!', date: '2024-07-18' }
    ]
  },
  {
    id: 'prod_4',
    name: 'Echo Smartwatch',
    description: 'Track your fitness, receive notifications, and more with the Echo Smartwatch. A perfect blend of technology and style.',
    category: 'Gadgets',
    variants: [
      { id: 'var_4_1', color: 'silver', size: '44mm', stock: 7, price: 249.99, imageUrl: 'https://picsum.photos/600/600?random=7' },
      { id: 'var_4_2', color: 'space gray', size: '44mm', stock: 5, price: 249.99, imageUrl: 'https://picsum.photos/600/600?random=8' },
    ],
    comments: []
  },
    {
    id: 'prod_5',
    name: 'Fusion Sneakers',
    description: 'Lightweight and breathable sneakers for everyday wear. Engineered for maximum comfort.',
    category: 'Footwear',
    variants: [
      { id: 'var_5_1', color: 'red', size: '9', stock: 11, price: 89.99, imageUrl: 'https://picsum.photos/600/600?random=9' },
      { id: 'var_5_2', color: 'red', size: '10', stock: 4, price: 89.99, imageUrl: 'https://picsum.photos/600/600?random=9' },
      { id: 'var_5_3', color: 'white', size: '9', stock: 14, price: 89.99, imageUrl: 'https://picsum.photos/600/600?random=10' },
    ],
    comments: [
        { id: 'comment_4', author: 'Runner22', rating: 5, text: 'So light and comfortable for my daily runs.', date: '2024-07-20' }
    ]
  },
  {
    id: 'prod_6',
    name: 'Orbit Backpack',
    description: 'A durable and spacious backpack with multiple compartments, perfect for work or travel.',
    category: 'Accessories',
    variants: [
      { id: 'var_6_1', color: 'charcoal', size: 'one size', stock: 22, price: 79.99, imageUrl: 'https://picsum.photos/600/600?random=11' },
    ],
    comments: []
  },
  {
    id: 'prod_7',
    name: 'Aero Wireless Buds',
    description: 'Immerse yourself in high-fidelity sound with these premium wireless earbuds.',
    category: 'Gadgets',
    variants: [
      { id: 'var_7_1', color: 'pearl', size: 'one size', stock: 0, price: 129.99, imageUrl: 'https://picsum.photos/600/600?random=12' },
      { id: 'var_7_2', color: 'obsidian', size: 'one size', stock: 1, price: 129.99, imageUrl: 'https://picsum.photos/600/600?random=13' },
    ],
    comments: []
  },
    {
    id: 'prod_8',
    name: 'Terra Cargo Pants',
    description: 'Functional and rugged cargo pants designed for adventure. Multiple pockets for all your essentials.',
    category: 'Apparel',
    variants: [
      { id: 'var_8_1', color: 'khaki', size: '32', stock: 18, price: 64.99, imageUrl: 'https://picsum.photos/600/600?random=14' },
      { id: 'var_8_2', color: 'olive', size: '34', stock: 6, price: 64.99, imageUrl: 'https://picsum.photos/600/600?random=15' },
    ],
    comments: []
  },
];

export const initialOrders: Order[] = [
  { id: 'order_1', customerName: 'John Doe', customerEmail: 'john.doe@example.com', date: '2024-07-20', status: 'Delivered', total: 89.98, paymentMethod: 'Credit Card', items: [], couponCode: 'SUMMER10' },
  { id: 'order_2', customerName: 'Jane Smith', customerEmail: 'jane.smith@example.com', date: '2024-07-21', status: 'Shipped', total: 124.98, paymentMethod: 'PayPal', items: [] },
  { id: 'order_3', customerName: 'Peter Jones', customerEmail: 'peter.jones@example.com', date: '2024-07-22', status: 'Pending', total: 24.99, paymentMethod: 'Credit Card', items: [], couponCode: 'WELCOME5' },
  { id: 'order_4', customerName: 'Mary Johnson', customerEmail: 'mary.j@example.com', date: '2024-07-22', status: 'Cancelled', total: 59.99, paymentMethod: 'Credit Card', items: [] },
  { id: 'order_5', customerName: 'John Doe', customerEmail: 'john.doe@example.com', date: '2024-07-23', status: 'Delivered', total: 5, paymentMethod: 'Credit Card', items: [], couponCode: 'WELCOME5' },

];

export const coupons: Coupon[] = [
    { id: 'coupon_1', code: 'SUMMER10', discountType: 'percentage', discountValue: 10, isActive: true, claims: 1, maxClaims: 100, validUntil: '2024-08-31' },
    { id: 'coupon_2', code: 'WELCOME5', discountType: 'fixed', discountValue: 5, isActive: true, applicableProductIds: ['prod_1', 'prod_3'], claims: 2, maxClaims: 2 },
    { id: 'coupon_3', code: 'SALE50', discountType: 'percentage', discountValue: 50, isActive: false, claims: 50, maxClaims: 50 },
];

export const couponUsage: CouponUsage[] = [
    { couponCode: 'SUMMER10', orderId: 'order_1', customerEmail: 'john.doe@example.com', usageDate: '2024-07-20', discountAmount: 10.00 },
    { couponCode: 'WELCOME5', orderId: 'order_3', customerEmail: 'peter.jones@example.com', usageDate: '2024-07-22', discountAmount: 5.00 },
    { couponCode: 'WELCOME5', orderId: 'order_5', customerEmail: 'john.doe@example.com', usageDate: '2024-07-23', discountAmount: 5.00 },
]

export const announcements: Announcement[] = [
    {
        id: 'announcement_1',
        title: 'Summer Collection is Here!',
        description: 'Check out our latest arrivals for the summer season. Fresh styles, bright colors, and the same great quality.',
        imageUrl: 'https://picsum.photos/1280/720?random=20',
        link: '/#all-products',
        tag: 'New Arrivals'
    },
    {
        id: 'announcement_2',
        title: 'Free Shipping on Orders Over $50',
        description: 'For a limited time, get free standard shipping on all orders over $50. No coupon code required!',
        imageUrl: 'https://picsum.photos/1280/720?random=21',
        link: '/#all-products',
        tag: 'Limited Time Offer'
    },
     {
        id: 'announcement_3',
        title: 'Join Our Rewards Program',
        description: 'Earn points on every purchase and get exclusive access to sales and new products. Sign up today!',
        imageUrl: 'https://picsum.photos/1280/720?random=22',
        link: '/login',
        tag: 'Get Rewards'
    }
];

export const userWishlist: UserWishlistItem[] = [
    { user: 'Demo User', productName: 'Nova Hoodie', variant: 'Navy / S', productId: 'prod_2', variantId: 'var_2_1' },
    { user: 'Demo User', productName: 'Quantum Cap', variant: 'Blue / One Size', productId: 'prod_3', variantId: 'var_3_2' },
    { user: 'Another User', productName: 'Cyber-Tee', variant: 'Black / L', productId: 'prod_1', variantId: 'var_1_2' }
];

export const initialSupportTickets: SupportTicket[] = [
    {
        id: 'ticket_1',
        status: 'open',
        messages: [
            { sender: 'user', text: 'Hi, I have a question about my order.', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
            { sender: 'admin', text: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
        ]
    },
    {
        id: 'ticket_2',
        status: 'closed',
        messages: [
            { sender: 'user', text: 'What is your return policy?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() }
        ]
    }
];

export const products: Product[] = initialProducts;
export const orders: Order[] = initialOrders;
export const supportTickets: SupportTicket[] = initialSupportTickets;
