
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

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
