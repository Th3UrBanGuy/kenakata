
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { WishlistItem } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './AuthProvider';
import { useFirebase } from './FirebaseProvider';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

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
  const { user } = useAuth();
  const { db } = useFirebase();

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          const dbWishlist = userData.wishlist || [];
          // Check if server wishlist is different from local state before updating
          if (JSON.stringify(dbWishlist) !== JSON.stringify(wishlist)) {
            setWishlist(dbWishlist);
          }
        }
      });
      return () => unsubscribe();
    } else {
      setWishlist([]); // Clear wishlist on logout
    }
  }, [user, db]);

  const addToWishlist = async (newItem: WishlistItem) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your wishlist.",
        variant: "destructive"
      });
      return;
    }
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
        wishlist: arrayUnion(newItem)
    });
    toast({
        title: "Added to wishlist",
        description: `Item has been added to your wishlist.`,
    });
  };

  const removeFromWishlist = async (variantId: string) => {
    if (!user) return;
    
    const itemToRemove = wishlist.find(item => item.variantId === variantId);
    if (!itemToRemove) return;

    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
        wishlist: arrayRemove(itemToRemove)
    });

    toast({
        title: "Removed from wishlist",
        description: `Item has been removed from your wishlist.`,
        variant: 'destructive'
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
