
'use client';

import { AuthProvider } from '@/context/AuthProvider';
import { CartProvider } from '@/context/CartProvider';
import { DataProvider } from '@/context/DataProvider';
import { WishlistProvider } from '@/context/WishlistProvider';
import { ReactNode } from 'react';
import { FirebaseProvider } from './FirebaseProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <DataProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </WishlistProvider>
        </DataProvider>
      </AuthProvider>
    </FirebaseProvider>
  );
}
