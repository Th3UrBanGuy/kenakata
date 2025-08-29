export type ProductVariant = {
  id: string;
  color: string;
  size: string;
  stock: number;
  price: number;
  imageUrl: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  variants: ProductVariant[];
};

export type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
  name: string;
  color: string;
  size: string;
  price: number;
  imageUrl: string;
};
