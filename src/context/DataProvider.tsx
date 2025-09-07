
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product, Order, AppUser, Coupon, CouponUsage } from '@/lib/types';
import { useFirebase } from './FirebaseProvider';
import { collection, onSnapshot, query, where, doc, runTransaction, addDoc, updateDoc, deleteDoc, setDoc, getDocs, writeBatch, arrayUnion, increment } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import { v4 as uuidv4 } from 'uuid';
import { getAuth, updateProfile } from 'firebase/auth';


interface DataContextType {
  products: Product[];
  orders: Order[];
  users: AppUser[];
  coupons: Coupon[];
  couponUsage: CouponUsage[];
  isLoading: boolean;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<string>;
  addProduct: (productData: Omit<Product, 'id' | 'comments'>) => Promise<void>;
  updateProduct: (productId: string, productData: Partial<Omit<Product, 'id' | 'comments'>>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addCoupon: (couponData: Partial<Omit<Coupon, 'id' | 'claims'>>) => Promise<void>;
  updateCoupon: (couponId: string, couponData: Partial<Omit<Coupon, 'id' | 'claims'>>) => Promise<void>;
  deleteCoupon: (couponId: string) => Promise<void>;
  toggleCouponStatus: (couponId: string, isActive: boolean) => Promise<void>;
  setUserRole: (userId: string, role: 'user' | 'admin') => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateAppUser: (userId: string, data: Partial<AppUser>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { db } = useFirebase();
  const { user, role } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponUsage, setCouponUsage] = useState<CouponUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const unsubscribers: (() => void)[] = [];
    
    const fetchData = () => {
      setIsLoading(true);

      const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
        if (!isMounted) return;
        const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productsData);
      }, (error) => console.error("Error fetching products:", error));
      unsubscribers.push(unsubProducts);

      const unsubCoupons = onSnapshot(collection(db, 'coupons'), (snapshot) => {
        if (!isMounted) return;
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
        setCoupons(data);
      });
      unsubscribers.push(unsubCoupons);
      
      const unsubCouponUsage = onSnapshot(collection(db, 'couponUsage'), (snapshot) => {
        if (!isMounted) return;
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CouponUsage));
        setCouponUsage(data);
      });
      unsubscribers.push(unsubCouponUsage);
      
      // Stop loading after initial fetches setup
      // A more robust solution might use Promise.all with getDocs for initial load
      setTimeout(() => {
        if (isMounted) setIsLoading(false);
      }, 1500); 
    };

    fetchData();

    return () => {
      isMounted = false;
      unsubscribers.forEach(unsub => unsub());
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
        setUsers([]); // Non-admins shouldn't have access to the user list
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

            // Pre-fetch all product documents
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
            
            // Validate coupon if one was applied
            if (orderData.couponCode) {
                 const couponsRef = collection(db, 'coupons');
                 const q = query(couponsRef, where("code", "==", orderData.couponCode));
                 const couponSnapshot = await getDocs(q); // Use getDocs, not transaction.get for queries
                 if (couponSnapshot.empty) {
                     throw new Error(`Coupon "${orderData.couponCode}" not found.`);
                 }
                 const couponDoc = couponSnapshot.docs[0];
                 const coupon = { id: couponDoc.id, ...couponDoc.data()} as Coupon;

                 if (!coupon.isActive) throw new Error("Coupon is not active.");
                 if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) throw new Error("Coupon has expired.");
                 if (coupon.maxClaims && (coupon.claims || 0) >= coupon.maxClaims) throw new Error("Coupon has reached its usage limit.");

                 // If all checks pass, increment the claim count and log the usage
                 const couponRef = doc(db, 'coupons', coupon.id);
                 transaction.update(couponRef, { claims: increment(1) });
                 
                 const usageRef = doc(collection(db, 'couponUsage'));
                 const usageLog: CouponUsage = {
                    id: usageRef.id,
                    couponCode: coupon.code,
                    orderId: newOrderRef.id,
                    customerEmail: orderData.customerEmail,
                    usageDate: new Date().toISOString(),
                    discountAmount: orderData.discountAmount || 0,
                 }
                 transaction.set(usageRef, usageLog);
            }

            // Process product stock updates
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

            // Finally, create the order document
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

  const updateProduct = async (productId: string, productData: Partial<Omit<Product, 'id' | 'comments'>>) => {
    const productRef = doc(db, 'products', productId);
    const variantsWithIds = productData.variants?.map(v => v.id ? v : {...v, id: `var_${uuidv4()}`});
    const updateData = {...productData};
    if(variantsWithIds) {
      updateData.variants = variantsWithIds;
    }
    await updateDoc(productRef, updateData);
  };

  const deleteProduct = async (productId: string) => {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  }

  const addCoupon = async (couponData: Partial<Omit<Coupon, 'id' | 'claims'>>) => {
    await addDoc(collection(db, 'coupons'), {
        ...couponData,
        claims: 0
    });
  }

  const updateCoupon = async (couponId: string, couponData: Partial<Omit<Coupon, 'id' | 'claims'>>) => {
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
    // This only deletes the firestore record. The auth user must be deleted separately.
    await deleteDoc(userRef);
  };
  
  const updateAppUser = async (userId: string, data: Partial<AppUser>) => {
    // Update Firestore document
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);

    // Update Firebase Auth profile if name is changed
    const auth = getAuth();
    if(auth.currentUser && data.name && auth.currentUser.displayName !== data.name) {
      await updateProfile(auth.currentUser, { displayName: data.name });
    }
  };


  return (
    <DataContext.Provider value={{ products, orders, users, coupons, couponUsage, isLoading, addOrder, addProduct, updateProduct, deleteProduct, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus, setUserRole, deleteUser, updateAppUser }}>
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
