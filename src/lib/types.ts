

export type AppUser = {
  uid: string;
  email: string | null;
  name: string | null;
  role: 'user' | 'admin';
  createdAt: any; // Firestore timestamp
  wishlist?: WishlistItem[];
}

export type ProductVariant = {
  id: string;
  color: string;
  size: string;
  stock: number;
  price: number;
  imageUrl: string;
};

export type Comment = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

export type Product = {
  id:string;
  name: string;
  description: string;
  category: string;
  variants: ProductVariant[];
  comments: Comment[];
  promotion?: string;
};

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
  name:string;
  color: string;
  size: string;
  price: number;
  imageUrl: string;
};

export type WishlistItem = {
  productId: string;
  variantId: string;
};

export type UserWishlistItem = {
  user: string;
  productName: string;
  variant: string;
  productId: string;
  variantId: string;
};

export type Order = {
  id: string;
  customerUid: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  paymentMethod: string;
  items: CartItem[];
  couponCode?: string;
};

export type Coupon = {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
  applicableProductIds?: string[];
  validUntil?: string; // ISO date string
  maxClaims?: number;
  claims?: number;
};

export type CouponUsage = {
    id: string;
    couponCode: string;
    orderId: string;
    customerEmail: string;
    usageDate: string; // ISO date string
    discountAmount: number;
}

export type Announcement = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  tag: string;
};

export type SupportMessage = {
    sender: 'user' | 'admin';
    text: string;
    timestamp: string;
};

export type SupportTicket = {
    id: string;
    status: 'open' | 'closed';
    messages: SupportMessage[];
};
