
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { WishlistItem } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (variantId: string) => void;
  isWishlisted: (variantId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  const addToWishlist = (newItem: WishlistItem) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.some(item => item.variantId === newItem.variantId)) {
        return prevWishlist;
      }
      toast({
        title: "Added to wishlist",
        description: `${newItem.name} has been added to your wishlist.`,
      });
      return [...prevWishlist, newItem];
    });
  };

  const removeFromWishlist = (variantId: string) => {
    setWishlist((prevWishlist) => {
        const itemToRemove = prevWishlist.find(item => item.variantId === variantId);
        if (itemToRemove) {
            toast({
                title: "Removed from wishlist",
                description: `${itemToRemove.name} has been removed from your wishlist.`,
                variant: 'destructive'
            });
        }
        return prevWishlist.filter((item) => item.variantId !== variantId)
    });
  };

  const isWishlisted = (variantId: string) => {
    return wishlist.some(item => item.variantId === variantId);
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
