
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
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
  const previousWishlist = useRef<WishlistItem[]>([]);

  useEffect(() => {
    // Check if an item was added
    if (previousWishlist.current.length < wishlist.length) {
      const addedItem = wishlist.find(
        (currentItem) => !previousWishlist.current.some((prevItem) => prevItem.variantId === currentItem.variantId)
      );
      if (addedItem) {
        toast({
          title: "Added to wishlist",
          description: `${addedItem.name} has been added to your wishlist.`,
        });
      }
    }
    
    // Check if an item was removed
    if (previousWishlist.current.length > wishlist.length) {
      const removedItem = previousWishlist.current.find(
        (prevItem) => !wishlist.some((currentItem) => currentItem.variantId === prevItem.variantId)
      );

      if (removedItem) {
        toast({
          title: "Removed from wishlist",
          description: `${removedItem.name} has been removed from your wishlist.`,
          variant: 'destructive'
        });
      }
    }
    // Update the ref to the current wishlist for the next render
    previousWishlist.current = wishlist;
  }, [wishlist, toast]);

  const addToWishlist = (newItem: WishlistItem) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.some(item => item.variantId === newItem.variantId)) {
        return prevWishlist;
      }
      return [...prevWishlist, newItem];
    });
  };

  const removeFromWishlist = (variantId: string) => {
    setWishlist((prevWishlist) => 
        prevWishlist.filter((item) => item.variantId !== variantId)
    );
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
