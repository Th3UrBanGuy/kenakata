
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import 'dotenv/config'

// Load config from environment variables
const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

// Check if all required environment variables are set
if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
    console.error("Firebase configuration is missing. Make sure you have a .env file with all the required NEXT_PUBLIC_FIREBASE_ variables.");
    process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function makeAdmin() {
  const emailToMakeAdmin = process.argv[2];

  if (!emailToMakeAdmin) {
    console.error("Please provide an email address for the user you want to make an admin.");
    console.error("Usage: npm run make:admin -- <user@example.com>");
    process.exit(1);
  }

  console.log(`Attempting to make '${emailToMakeAdmin}' an admin...`);

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("email", "==", emailToMakeAdmin));
    
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error(`Error: No user found with the email '${emailToMakeAdmin}'.`);
      process.exit(1);
    }
    
    if (querySnapshot.size > 1) {
        console.warn(`Warning: Multiple users found with the email '${emailToMakeAdmin}'. Promoting the first one found.`);
    }

    const userDoc = querySnapshot.docs[0];
    const userDocRef = doc(db, 'users', userDoc.id);

    await updateDoc(userDocRef, {
      role: 'admin'
    });

    console.log(`Successfully promoted '${emailToMakeAdmin}' (UID: ${userDoc.id}) to an admin.`);

  } catch (error: any) {
    console.error("Error making user an admin:", error);
    process.exit(1);
  }
}

makeAdmin().then(() => {
    console.log("Script finished. Exiting...");
    process.exit(0);
});
