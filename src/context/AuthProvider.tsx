
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useFirebase } from './FirebaseProvider';
import { onAuthStateChanged, User } from 'firebase/auth';

type Role = 'user' | 'admin' | null;

interface AuthContextType {
  isAuthenticated: boolean | null; // null when loading, boolean when determined
  user: User | null;
  role: Role;
  login: (role: 'user' | 'admin') => void; // This will be replaced with real auth
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [role, setRole] = useState<Role>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        // Role logic will be added here later
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);


  const login = (newRole: 'user' | 'admin') => {
    // This is a placeholder for the actual login logic
    // For now, we'll just set the role for demo purposes.
    setRole(newRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    auth.signOut();
    if (pathname.includes('/account') || pathname.includes('/admin')) {
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout }}>
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
