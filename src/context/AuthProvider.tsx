
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

type Role = 'user' | 'admin' | null;

interface AuthContextType {
  isAuthenticated: boolean | null; // null when loading, boolean when determined
  role: Role;
  login: (role: 'user' | 'admin') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [role, setRole] = useState<Role>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // On initial load, check if auth state exists in sessionStorage
    const storedAuth = sessionStorage.getItem('isAuthenticated');
    const storedRole = sessionStorage.getItem('role') as Role;
    if (storedAuth === 'true' && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
  }, []);

  const login = (newRole: 'user' | 'admin') => {
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('role', newRole);
    setIsAuthenticated(true);
    setRole(newRole);
  };

  const logout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole(null);
    if (pathname.includes('/account') || pathname.includes('/admin')) {
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
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
