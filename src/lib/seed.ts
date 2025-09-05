
// This is a script to seed your Firestore database with initial data.
// You can run this from your browser's developer console or via the npm script.

import { collection, doc, writeBatch } from "firebase/firestore";
import { initialProducts } from "./data";
import type { Firestore } from "firebase/firestore";


export async function seedDatabase(db: Firestore) {
    const productsCollection = collection(db, "products");
    const batch = writeBatch(db);

    console.log("Seeding products...");

    initialProducts.forEach((product) => {
        const docRef = doc(productsCollection, product.id);
        batch.set(docRef, product);
    });

    try {
        await batch.commit();
        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database: ", error);
    }
}
