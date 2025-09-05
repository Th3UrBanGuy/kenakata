
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useFirebase } from './FirebaseProvider';
import { 
    onAuthStateChanged, 
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { AppUser } from '@/lib/types';

type Role = 'user' | 'admin' | null;

interface AuthContextType {
  user: User | null;
  role: Role;
  isLoading: boolean;
  register: (email: string, pass: string, name: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  loginAsAdmin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth, db } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      if (user) {
        setUser(user);
        // Fetch user role from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        } else {
          // This case might happen if a user was authenticated but their doc was deleted
          setRole('user');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const register = async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;
    
    // Create a user document in Firestore
    const userDocRef = doc(db, 'users', newUser.uid);
    const newAppUser: AppUser = {
      uid: newUser.uid,
      email: newUser.email,
      name: name,
      role: 'user', // Default role
      createdAt: new Date(),
      wishlist: []
    };
    await setDoc(userDocRef, newAppUser);
    
    setUser(newUser);
    setRole(newAppUser.role);
  };
  
  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    // onAuthStateChanged will handle setting user and role
  };
  
  const loginAsAdmin = () => {
    // This is a dev-only function to simulate an admin login
    // In a real app, this would not exist.
    setRole('admin');
    // We can simulate a user object for dev purposes if needed
    // For now, many components check role > user
  }

  const logout = async () => {
    await signOut(auth);
    setRole(null);
    if (pathname.includes('/account') || pathname.includes('/admin')) {
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, register, login, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
