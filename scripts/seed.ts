
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { collection, doc, writeBatch } from "firebase/firestore";
import { initialProducts } from "../src/lib/data";

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
