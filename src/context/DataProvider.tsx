
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Product, Order, SupportTicket } from '@/lib/types';
import { initialProducts, initialOrders, initialSupportTickets } from '@/lib/data';

interface DataContextType {
  products: Product[];
  orders: Order[];
  supportTickets: SupportTicket[];
  addOrder: (order: Order) => void;
  updateProductStock: (productId: string, variantId: string, change: number) => void;
  addSupportMessage: (ticketId: string, text: string) => void;
  addSupportReply: (ticketId: string, text: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);

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
  
  const addSupportMessage = (ticketId: string, text: string) => {
    setSupportTickets(prevTickets => {
        const existingTicket = prevTickets.find(t => t.id === ticketId);
        const newMessage = { sender: 'user' as const, text, timestamp: new Date().toISOString() };
        
        if (existingTicket) {
            return prevTickets.map(t => 
                t.id === ticketId ? { ...t, status: 'open' as const, messages: [...t.messages, newMessage] } : t
            );
        } else {
            const newTicket: SupportTicket = {
                id: ticketId,
                status: 'open',
                messages: [newMessage]
            };
            return [...prevTickets, newTicket];
        }
    });
  };

  const addSupportReply = (ticketId: string, text: string) => {
      setSupportTickets(prevTickets => {
          return prevTickets.map(t => {
              if (t.id === ticketId) {
                  const newReply = { sender: 'admin' as const, text, timestamp: new Date().toISOString() };
                  return { ...t, messages: [...t.messages, newReply] };
              }
              return t;
          });
      });
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
