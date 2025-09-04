
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Product, Order } from '@/lib/types';
import { initialProducts, initialOrders } from '@/lib/data';

interface DataContextType {
  products: Product[];
  orders: Order[];
  addOrder: (order: Order) => void;
  updateProductStock: (productId: string, variantId: string, change: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addOrder = (newOrder: Order) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  const updateProductStock = (productId: string, variantId: string, change: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            variants: product.variants.map((variant) => {
              if (variant.id === variantId) {
                return { ...variant, stock: variant.stock + change };
              }
              return variant;
            }),
          };
        }
        return product;
      })
    );
  };

  return (
    <DataContext.Provider value={{ products, orders, addOrder, updateProductStock }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
