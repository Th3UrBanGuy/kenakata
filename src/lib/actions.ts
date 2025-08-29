'use server';

import { analyzeInventoryLevels, AnalyzeInventoryLevelsInput, AnalyzeInventoryLevelsOutput } from "@/ai/flows/inventory-shortage-alerts";
import { products as allProducts } from "./data";

export async function getInventoryAnalysis(): Promise<AnalyzeInventoryLevelsOutput | { error: string }> {
    try {
        const inventoryData: AnalyzeInventoryLevelsInput['products'] = allProducts.flatMap(product =>
            product.variants.map(variant => ({
                productId: `${product.id}-${variant.id}`, // Create a unique ID for each variant
                productName: `${product.name} (${variant.color}, ${variant.size})`,
                currentStock: variant.stock,
                threshold: 10, // Hardcode threshold for demo purposes
            }))
        );

        if (inventoryData.length === 0) {
            return { lowStockProducts: [], outOfStockProducts: [] };
        }

        const analysis = await analyzeInventoryLevels({ products: inventoryData });
        return analysis;
    } catch (error) {
        console.error("Error analyzing inventory:", error);
        return { error: "Failed to analyze inventory." };
    }
}
