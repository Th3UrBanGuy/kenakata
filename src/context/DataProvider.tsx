

'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product, Order, SupportTicket, AppUser } from '@/lib/types';
import { initialSupportTickets } from '@/lib/data';
import { useFirebase } from './FirebaseProvider';
import { collection, onSnapshot, query, where, doc, runTransaction, addDoc, updateDoc, deleteDoc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import { v4 as uuidv4 } from 'uuid';


interface DataContextType {
  products: Product[];
  orders: Order[];
  users: AppUser[];
  supportTickets: SupportTicket[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<string>;
  addProduct: (productData: Omit<Product, 'id' | 'comments'>) => Promise<void>;
  updateProduct: (productId: string, productData: Omit<Product, 'id' | 'comments'>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
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
    if (!user || !role) {
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

            for (const item of orderData.items) {
                const { doc: productDoc, ref: productRef } = productRefs.get(item.productId);
                const productData = productDoc.data() as Product;
                
                const variantIndex = productData.variants.findIndex(v => v.id === item.variantId);
                if (variantIndex === -1) {
                    throw new Error(`Variant ${item.variantId} not found in product ${item.productId}`);
                }
                if (productData.variants[variantIndex].stock < item.quantity) {
                    throw new Error(`Not enough stock for ${productData.name} (${productData.variants[variantIndex].color}/${productData.variants[variantIndex].size})`);
                }
                
                productData.variants[variantIndex].stock -= item.quantity;
                
                if (!productsToUpdate.some(p => p.ref.path === productRef.path)) {
                    productsToUpdate.push({ ref: productRef, data: productData });
                }
            }

            productsToUpdate.forEach(({ ref, data }) => {
                transaction.update(ref, { variants: data.variants });
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
        throw e;
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'comments'>) => {
    const newProductId = `prod_${uuidv4()}`;
    const variantsWithIds = productData.variants.map(v => ({...v, id: `var_${uuidv4()}`}));
    const newProduct: Product = {
        ...productData,
        id: newProductId,
        variants: variantsWithIds,
        comments: []
    }
    await setDoc(doc(db, 'products', newProductId), newProduct);
  };

  const updateProduct = async (productId: string, productData: Omit<Product, 'id' | 'comments'>) => {
    const productRef = doc(db, 'products', productId);
    const variantsWithIds = productData.variants.map(v => v.id ? v : {...v, id: `var_${uuidv4()}`});
    await updateDoc(productRef, {...productData, variants: variantsWithIds});
  };

  const deleteProduct = async (productId: string) => {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  }
  
  const addSupportMessage = (ticketId: string, text: string) => {
     // TODO: Implement Firestore logic
  };

  const addSupportReply = (ticketId: string, text: string) => {
       // TODO: Implement Firestore logic
  };


  return (
    <DataContext.Provider value={{ products, orders, users, supportTickets, addOrder, addProduct, updateProduct, deleteProduct, addSupportMessage, addSupportReply }}>
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
