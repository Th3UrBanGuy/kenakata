
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useFirebase } from './FirebaseProvider';
import { 
    onAuthStateChanged, 
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    deleteUser as deleteFirebaseUser,
    sendEmailVerification,
    updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import type { AppUser } from '@/lib/types';

type Role = 'user' | 'admin' | null;

interface AuthContextType {
  user: User | null;
  role: Role;
  isLoading: boolean;
  register: (email: string, pass: string, name: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  sendPasswordReset: () => Promise<void>;
  deleteCurrentUser: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<void>;
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
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        } else {
          // This case might happen if the Firestore doc is deleted but auth record isn't
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

    // Update Firebase Auth profile
    await updateProfile(newUser, { displayName: name });
    
    // Send verification email
    await sendEmailVerification(newUser);
    
    const userDocRef = doc(db, 'users', newUser.uid);
    const newAppUser: AppUser = {
      uid: newUser.uid,
      email: newUser.email,
      name: name,
      role: 'user',
      createdAt: new Date(),
      wishlist: []
    };
    await setDoc(userDocRef, newAppUser);
    
    setUser(newUser);
    setRole(newAppUser.role);
  };
  
  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting the user and role state after successful login.
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please try again.');
      }
      // Re-throw other errors to be handled by the caller
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setRole(null);
    setUser(null);
    // Redirect to home and clear router cache to prevent showing protected pages
    router.push('/');
    router.refresh();
  };
  
  const reloadUser = async () => {
      if (!auth.currentUser) return;
      await auth.currentUser.reload();
      // To force an immediate re-render with the new state:
      setUser({...auth.currentUser});
  };

  const sendPasswordReset = async () => {
    if (!user || !user.email) {
        throw new Error("You must be logged in to reset your password.");
    }
    await sendPasswordResetEmail(auth, user.email);
  };

  const deleteCurrentUser = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
          throw new Error("No user is currently logged in.");
      }
      try {
          // First, delete the Firestore document
          const userDocRef = doc(db, 'users', currentUser.uid);
          await deleteDoc(userDocRef);

          // Then, delete the Firebase Auth user
          await deleteFirebaseUser(currentUser);
          
          setUser(null);
          setRole(null);
          router.push('/');
          router.refresh();
      } catch (error: any) {
          console.error("Error deleting user:", error);
          // Handle re-authentication if required
          if (error.code === 'auth/requires-recent-login') {
              throw new Error("This is a sensitive operation and requires recent authentication. Please log in again before deleting your account.");
          }
          throw error;
      }
  };
  
  const sendVerificationEmail = async () => {
      if (!auth.currentUser) {
          throw new Error("No user is currently logged in to send verification email.");
      }
      await sendEmailVerification(auth.currentUser);
  }


  return (
    <AuthContext.Provider value={{ user, role, isLoading, register, login, logout, sendPasswordReset, deleteCurrentUser, sendVerificationEmail, reloadUser }}>
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
