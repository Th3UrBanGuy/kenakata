

'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product, Order, SupportTicket, AppUser } from '@/lib/types';
import { initialSupportTickets } from '@/lib/data';
import { useFirebase } from './FirebaseProvider';
import { collection, onSnapshot, query, where, doc, runTransaction, serverTimestamp, addDoc, getDocs, writeBatch } from 'firebase/firestore';
import { useAuth } from './AuthProvider';

interface DataContextType {
  products: Product[];
  orders: Order[];
  users: AppUser[];
  supportTickets: SupportTicket[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<string>;
  updateProductStock: (productId: string, variantId: string, change: number) => void; // This will be handled by addOrder transaction
  addSupportMessage: (ticketId: string, text: string) => void;
  addSupportReply: (ticketId: string, text: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { db } = useFirebase();
  const { user, role } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsData);
    });

    return () => unsubProducts();
  }, [db]);
  
  useEffect(() => {
    if (!user || !role) { // Ensure role is determined
        setOrders([]);
        setUsers([]);
        return;
    }

    let unsubOrders: () => void;
    let unsubUsers: () => void;

    if (role === 'admin') {
        unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(ordersData);
        });
        unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
            const usersData = snapshot.docs.map(doc => doc.data() as AppUser);
            setUsers(usersData);
        });

    } else if (role === 'user') {
        const q = query(collection(db, "orders"), where("customerUid", "==", user.uid));
        unsubOrders = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(ordersData);
        });
        // Regular users don't fetch all users
        setUsers([]);
    }

    return () => {
        if (unsubOrders) unsubOrders();
        if (unsubUsers) unsubUsers();
    };

  }, [db, user, role]);


  const addOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status'>): Promise<string> => {
    const newOrderRef = doc(collection(db, 'orders'));
    
    try {
        await runTransaction(db, async (transaction) => {
            const productRefs = new Map<string, any>();
            const productsToUpdate: {ref: any, data: Product}[] = [];

            // First, read all necessary product documents
            for (const item of orderData.items) {
                if (!productRefs.has(item.productId)) {
                    const productRef = doc(db, 'products', item.productId);
                    const productDoc = await transaction.get(productRef);
                    if (!productDoc.exists()) {
                        throw new Error(`Product with ID ${item.productId} not found!`);
                    }
                    productRefs.set(item.productId, { ref: productRef, doc: productDoc });
                }
            }

            // Now, process updates
            for (const item of orderData.items) {
                const { doc: productDoc, ref: productRef } = productRefs.get(item.productId);
                const productData = productDoc.data() as Product;
                
                const variant = productData.variants.find(v => v.id === item.variantId);
                if (!variant) {
                    throw new Error(`Variant ${item.variantId} not found in product ${item.productId}`);
                }
                if (variant.stock < item.quantity) {
                    throw new Error(`Not enough stock for ${productData.name} (${variant.color}/${variant.size})`);
                }
                
                // Decrement stock
                variant.stock -= item.quantity;
                
                productsToUpdate.push({ ref: productRef, data: productData });
            }

            // Perform all writes
            productsToUpdate.forEach(({ ref, data }) => {
                transaction.set(ref, data);
            });

            const completeOrder = {
                ...orderData,
                id: newOrderRef.id,
                date: new Date().toISOString(),
                status: 'Pending' as const,
            };

            transaction.set(newOrderRef, completeOrder);
        });
        return newOrderRef.id;
    } catch (e: any) {
        console.error("Order transaction failed: ", e);
        throw e; // Re-throw to be caught by the UI
    }
  };

  const updateProductStock = (productId: string, variantId: string, change: number) => {
     // This is now handled within the `addOrder` transaction for atomicity.
     // This function can be removed or kept for other potential uses.
     console.warn("updateProductStock should not be called directly for sales. It's handled by the addOrder transaction.");
  };
  
  const addSupportMessage = (ticketId: string, text: string) => {
     // TODO: Implement Firestore logic
  };

  const addSupportReply = (ticketId: string, text: string) => {
       // TODO: Implement Firestore logic
  };


  return (
    <DataContext.Provider value={{ products, orders, users, supportTickets, addOrder, updateProductStock, addSupportMessage, addSupportReply }}>
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
