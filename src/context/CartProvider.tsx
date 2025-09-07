
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import type { CartItem, Coupon } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase } from './FirebaseProvider';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (couponCode: string) => Promise<void>;
  removeCoupon: () => void;
  isApplyingCoupon: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { db } = useFirebase();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = sessionStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      const storedCoupon = sessionStorage.getItem('coupon');
      if (storedCoupon) {
        setAppliedCoupon(JSON.parse(storedCoupon));
      }
    } catch (error) {
      console.error("Failed to parse cart/coupon from sessionStorage", error);
      setCart([]);
      setAppliedCoupon(null);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedCoupon) {
        sessionStorage.setItem('coupon', JSON.stringify(appliedCoupon));
    } else {
        sessionStorage.removeItem('coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.variantId === newItem.variantId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.variantId === newItem.variantId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...newItem, quantity: 1 }];
    });
    toast({
        title: "Added to cart",
        description: `${newItem.name} has been added to your cart.`,
    })
  };

  const removeFromCart = (variantId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };
  
  const applyCoupon = async (couponCode: string) => {
    setIsApplyingCoupon(true);
    try {
        const couponsRef = collection(db, 'coupons');
        const q = query(couponsRef, where("code", "==", couponCode.toUpperCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("Invalid coupon code.");
        }
        
        const coupon = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Coupon;

        if (!coupon.isActive) throw new Error("This coupon is not active.");
        if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) throw new Error("This coupon has expired.");
        if (coupon.maxClaims && (coupon.claims || 0) >= coupon.maxClaims) throw new Error("This coupon has reached its usage limit.");

        setAppliedCoupon(coupon);
        toast({ title: "Coupon Applied", description: `Successfully applied coupon "${coupon.code}".` });

    } catch (error: any) {
        toast({ title: "Apply Failed", description: error.message, variant: "destructive" });
    } finally {
        setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast({ title: "Coupon Removed" });
  };

  const totalItems = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

  const { discount, total } = useMemo(() => {
    let discount = 0;
    if (appliedCoupon) {
        let applicableSubtotal = subtotal;

        if (appliedCoupon.applicableProductIds && appliedCoupon.applicableProductIds.length > 0) {
            applicableSubtotal = cart.reduce((sum, item) => {
                if (appliedCoupon.applicableProductIds?.includes(item.productId)) {
                    return sum + item.price * item.quantity;
                }
                return sum;
            }, 0);
        }

        if (appliedCoupon.discountType === 'fixed') {
            discount = Math.min(appliedCoupon.discountValue, applicableSubtotal);
        } else if (appliedCoupon.discountType === 'percentage') {
            discount = applicableSubtotal * (appliedCoupon.discountValue / 100);
        }
    }
    const total = subtotal - discount;
    return { discount, total };

  }, [subtotal, appliedCoupon, cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, discount, total, appliedCoupon, applyCoupon, removeCoupon, isApplyingCoupon }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
