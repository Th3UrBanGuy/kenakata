
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "kenakata-online-store",
  appId: "1:226909259084:web:70078f69682f33593dfbe9",
  storageBucket: "kenakata-online-store.firebasestorage.app",
  apiKey: "AIzaSyDWeyM0pfNtBZJqZZ4y6Ojxc3akKt6Zykc",
  authDomain: "kenakata-online-store.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "226909259084"
};

interface FirebaseContextType {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  return (
    <FirebaseContext.Provider value={{ app: firebaseApp, auth, db }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
