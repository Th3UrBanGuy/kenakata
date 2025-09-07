
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { collection, doc, writeBatch } from "firebase/firestore";
import { initialProducts } from "../src/lib/data";
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

async function seedDatabase() {
    const productsCollection = collection(db, "products");
    const batch = writeBatch(db);

    console.log("Seeding products...");

    initialProducts.forEach((product) => {
        // Use the product's existing ID as the document ID
        const docRef = doc(productsCollection, product.id);
        batch.set(docRef, product);
    });

    try {
        await batch.commit();
        console.log("Database seeded successfully!");
        console.log(`Seeded ${initialProducts.length} products.`);
    } catch (error) {
        console.error("Error seeding database: ", error);
        process.exit(1);
    }
}

seedDatabase().then(() => {
    console.log("Seeding complete. Exiting...");
    process.exit(0);
});
