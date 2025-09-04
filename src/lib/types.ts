

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
  name: string;
  price: number;
  imageUrl: string;
  color: string;
  size: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  paymentMethod: string;
};

export type Coupon = {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
  applicableProductIds?: string[];
};

export type Announcement = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  tag: string;
};
