
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product, Order, SupportTicket } from '@/lib/types';
import { initialProducts, initialOrders, initialSupportTickets } from '@/lib/data';
import { useFirebase } from './FirebaseProvider';
import { collection, onSnapshot } from 'firebase/firestore';

interface DataContextType {
  products: Product[];
  orders: Order[];
  supportTickets: SupportTicket[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  updateProductStock: (productId: string, variantId: string, change: number) => void;
  addSupportMessage: (ticketId: string, text: string) => void;
  addSupportReply: (ticketId: string, text: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { db } = useFirebase();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsData);
    });
    return () => unsub();
  }, [db]);


  const addOrder = (newOrder: Omit<Order, 'id' | 'date' | 'status'>) => {
    // This will be updated to use firestore
  };

  const updateProductStock = (productId: string, variantId: string, change: number) => {
     // This will be updated to use firestore
  };
  
  const addSupportMessage = (ticketId: string, text: string) => {
     // This will be updated to use firestore
  };

  const addSupportReply = (ticketId: string, text: string) => {
       // This will be updated to use firestore
  };


  return (
    <DataContext.Provider value={{ products, orders, supportTickets, addOrder, updateProductStock, addSupportMessage, addSupportReply }}>
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
