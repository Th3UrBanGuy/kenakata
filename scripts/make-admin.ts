
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import type { AppUser } from '../src/lib/types';

// This is the same config from your FirebaseProvider
const firebaseConfig = {
  projectId: "kenakata-online-store",
  appId: "1:226909259084:web:70078f69682f33593dfbe9",
  storageBucket: "kenakata-online-store.firebasestorage.app",
  apiKey: "AIzaSyDWeyM0pfNtBZJqZZ4y6Ojxc3akKt6Zykc",
  authDomain: "kenakata-online-store.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "226909259084"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const adminEmail = "admin@a.com";
const adminPassword = "Ra726ma@#$";

async function makeAdmin() {
  console.log(`Attempting to create admin user: ${adminEmail}`);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const newUser = userCredential.user;

    console.log(`User created successfully in Firebase Auth with UID: ${newUser.uid}`);

    const userDocRef = doc(db, 'users', newUser.uid);
    const newAppUser: AppUser = {
      uid: newUser.uid,
      email: newUser.email,
      name: 'Store Administrator',
      role: 'admin',
      createdAt: new Date(),
      wishlist: []
    };

    await setDoc(userDocRef, newAppUser);

    console.log(`User role set to 'admin' in Firestore.`);
    console.log("Admin user created successfully!");
    
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
        console.error(`Error: The email ${adminEmail} is already in use.`);
        console.error("If you want to make this existing user an admin, please do so from the Firebase console or create a script to update the user's role.");
    } else {
        console.error("Error creating admin user:", error);
    }
    process.exit(1);
  }
}

makeAdmin().then(() => {
    console.log("Script finished. Exiting...");
    process.exit(0);
});
