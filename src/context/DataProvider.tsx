
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product, Order, SupportTicket, AppUser, Coupon, CouponUsage } from '@/lib/types';
import { useFirebase } from './FirebaseProvider';
import { collection, onSnapshot, query, where, doc, runTransaction, addDoc, updateDoc, deleteDoc, setDoc, getDocs, writeBatch, arrayUnion } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import { v4 as uuidv4 } from 'uuid';


interface DataContextType {
  products: Product[];
  orders: Order[];
  users: AppUser[];
  supportTickets: SupportTicket[];
  coupons: Coupon[];
  couponUsage: CouponUsage[];
  isLoading: boolean;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<string>;
  addProduct: (productData: Omit<Product, 'id' | 'comments'>) => Promise<void>;
  updateProduct: (productId: string, productData: Omit<Product, 'id' | 'comments'>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addCoupon: (couponData: Omit<Coupon, 'id' | 'claims'>) => Promise<void>;
  updateCoupon: (couponId: string, couponData: Omit<Coupon, 'id' | 'claims'>) => Promise<void>;
  deleteCoupon: (couponId: string) => Promise<void>;
  toggleCouponStatus: (couponId: string, isActive: boolean) => Promise<void>;
  setUserRole: (userId: string, role: 'user' | 'admin') => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  addSupportMessage: (ticketId: string, text: string) => Promise<void>;
  addSupportReply: (ticketId: string, text: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { db } = useFirebase();
  const { user, role } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponUsage, setCouponUsage] = useState<CouponUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsData);
        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
    });

    const unsubCoupons = onSnapshot(collection(db, 'coupons'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
        setCoupons(data);
    });
    
    const unsubCouponUsage = onSnapshot(collection(db, 'couponUsage'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CouponUsage));
        setCouponUsage(data);
    });
    
    const unsubSupportTickets = onSnapshot(collection(db, 'supportTickets'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportTicket));
        setSupportTickets(data);
    });

    return () => {
        unsubProducts();
        unsubCoupons();
        unsubCouponUsage();
        unsubSupportTickets();
    };
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

  const addCoupon = async (couponData: Omit<Coupon, 'id' | 'claims'>) => {
    await addDoc(collection(db, 'coupons'), {
        ...couponData,
        claims: 0
    });
  }

  const updateCoupon = async (couponId: string, couponData: Omit<Coupon, 'id' | 'claims'>) => {
    const couponRef = doc(db, 'coupons', couponId);
    await updateDoc(couponRef, couponData);
  }

  const deleteCoupon = async (couponId: string) => {
    const couponRef = doc(db, 'coupons', couponId);
    await deleteDoc(couponRef);
  }

  const toggleCouponStatus = async (couponId: string, isActive: boolean) => {
    const couponRef = doc(db, 'coupons', couponId);
    await updateDoc(couponRef, { isActive });
  }

  const setUserRole = async (userId: string, role: 'user' | 'admin') => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role });
  };

  const deleteUser = async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  };
  
  const addSupportMessage = async (ticketId: string, text: string) => {
    const ticketRef = doc(db, 'supportTickets', ticketId);
    const message = {
        sender: 'user' as const,
        text,
        timestamp: new Date().toISOString()
    };
    
    try {
        await runTransaction(db, async (transaction) => {
            const ticketDoc = await transaction.get(ticketRef);
            if (!ticketDoc.exists()) {
                transaction.set(ticketRef, {
                    status: 'open',
                    messages: [message]
                });
            } else {
                transaction.update(ticketRef, {
                    messages: arrayUnion(message),
                    status: 'open'
                });
            }
        });
    } catch (error) {
        console.error("Error sending message:", error);
    }
  };

  const addSupportReply = async (ticketId: string, text: string) => {
    const ticketRef = doc(db, 'supportTickets', ticketId);
    const message = {
        sender: 'admin' as const,
        text,
        timestamp: new Date().toISOString()
    };
    await updateDoc(ticketRef, {
        messages: arrayUnion(message)
    });
  };


  return (
    <DataContext.Provider value={{ products, orders, users, supportTickets, coupons, couponUsage, isLoading, addOrder, addProduct, updateProduct, deleteProduct, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus, setUserRole, deleteUser, addSupportMessage, addSupportReply }}>
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
