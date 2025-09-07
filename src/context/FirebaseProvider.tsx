
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

interface FirebaseContextType {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

let firebaseApp: FirebaseApp;

// Check if all required environment variables are set
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApp();
    }
} else {
    console.error("Firebase configuration is missing or incomplete. Please check your .env file.");
    // Provide a dummy app to avoid crashing the app
    firebaseApp = {} as FirebaseApp;
}


const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
            <div className="w-full max-w-md p-6 rounded-lg border text-center">
                <h1 className="text-2xl font-bold text-destructive mb-2">Firebase Not Configured</h1>
                <p className="text-muted-foreground">
                    Your Firebase environment variables are missing. Please create a 
                    <code className="bg-muted text-muted-foreground font-mono p-1 rounded-sm">.env</code> 
                    file and add your Firebase project configuration to continue.
                </p>
            </div>
        </div>
    );
  }
  
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
