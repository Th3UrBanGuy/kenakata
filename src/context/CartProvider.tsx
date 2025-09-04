
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { CartItem } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load cart from sessionStorage on initial render
    try {
      const storedCart = sessionStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from sessionStorage", error);
      setCart([]);
    }
  }, []);

  useEffect(() => {
    // Save cart to sessionStorage whenever it changes
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);


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
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
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
