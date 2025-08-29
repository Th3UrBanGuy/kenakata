'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing inventory levels and
 * highlighting products that are low in stock or out of stock.
 *
 * - analyzeInventoryLevels - A function that triggers the inventory analysis flow.
 * - AnalyzeInventoryLevelsInput - The input type for the analyzeInventoryLevels function.
 * - AnalyzeInventoryLevelsOutput - The return type for the analyzeInventoryLevels function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define schemas for input and output
const AnalyzeInventoryLevelsInputSchema = z.object({
  products: z.array(
    z.object({
      productId: z.string().describe('Unique identifier for the product.'),
      productName: z.string().describe('Name of the product.'),
      currentStock: z.number().describe('Current stock level of the product.'),
      threshold: z.number().describe('Threshold below which the product is considered low stock.'),
    })
  ).describe('Array of product objects with inventory information.'),
});
export type AnalyzeInventoryLevelsInput = z.infer<typeof AnalyzeInventoryLevelsInputSchema>;

const AnalyzeInventoryLevelsOutputSchema = z.object({
  lowStockProducts: z.array(
    z.object({
      productId: z.string().describe('The product ID of the low stock product.'),
      productName: z.string().describe('The product name of the low stock product.'),
      currentStock: z.number().describe('The current stock level of the low stock product.'),
      alertMessage: z.string().describe('A message indicating the shortage and suggesting actions.'),
    })
  ).describe('Array of products that are low in stock.'),
  outOfStockProducts: z.array(
    z.object({
      productId: z.string().describe('The product ID of the out of stock product.'),
      productName: z.string().describe('The product name of the out of stock product.'),
      alertMessage: z.string().describe('A message indicating the product is out of stock.'),
    })
  ).describe('Array of products that are out of stock.'),
});
export type AnalyzeInventoryLevelsOutput = z.infer<typeof AnalyzeInventoryLevelsOutputSchema>;

// Exported function to call the flow
export async function analyzeInventoryLevels(input: AnalyzeInventoryLevelsInput): Promise<AnalyzeInventoryLevelsOutput> {
  return analyzeInventoryLevelsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'inventoryShortageAlertsPrompt',
  input: {schema: AnalyzeInventoryLevelsInputSchema},
  output: {schema: AnalyzeInventoryLevelsOutputSchema},
  prompt: `You are an inventory management expert. Analyze the following product inventory data and identify products that are low in stock or out of stock.  A product is considered low stock when the currentStock is less than the threshold. Provide specific alert messages for each product. If a product is low on stock, suggest reordering. If a product is out of stock, indicate that it needs immediate attention.

Products:{{#each products}}\nProduct ID: {{productId}}, Product Name: {{productName}}, Current Stock: {{currentStock}}, Threshold: {{threshold}}{{#if @last}}{{else}},{{/if}}{{/each}}`,
});

// Define the Genkit flow
const analyzeInventoryLevelsFlow = ai.defineFlow(
  {
    name: 'analyzeInventoryLevelsFlow',
    inputSchema: AnalyzeInventoryLevelsInputSchema,
    outputSchema: AnalyzeInventoryLevelsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
