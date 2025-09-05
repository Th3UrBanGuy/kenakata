

'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product, Order, SupportTicket } from '@/lib/types';
import { initialSupportTickets } from '@/lib/data';
import { useFirebase } from './FirebaseProvider';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from './AuthProvider';

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
  const { user, role } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);

  useEffect(() => {
    // Listen for product changes - this is public data
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsData);
    });

    return () => unsubProducts();
  }, [db]);
  
  useEffect(() => {
    // Role-based data fetching
    if (!user) {
        setOrders([]);
        return;
    }

    let unsubOrders: () => void;

    if (role === 'admin') {
        // Admin: fetch all orders
        unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(ordersData);
        });

    } else {
        // Regular user: fetch only their own orders
        const q = query(collection(db, "orders"), where("customerUid", "==", user.uid));
        unsubOrders = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(ordersData);
        });
    }

    return () => {
        if (unsubOrders) {
            unsubOrders();
        }
    };

  }, [db, user, role]);


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
