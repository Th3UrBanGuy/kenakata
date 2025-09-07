
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataProvider';
import { useState } from 'react';

const variantSchema = z.object({
  id: z.string().optional(), 
  color: z.string().min(1, 'Color is required'),
  size: z.string().min(1, 'Size is required'),
  stock: z.coerce.number().min(0, 'Stock must be non-negative'),
  price: z.coerce.number().min(0.01, 'Price is required'),
  imageUrl: z.string().url('Must be a valid URL'),
});

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  variants: z.array(variantSchema).min(1, 'At least one variant is required'),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const { addProduct, updateProduct } = useData();
    const [isSaving, setIsSaving] = useState(false);

    const defaultValues = product ? 
        {
            name: product.name,
            description: product.description,
            category: product.category,
            variants: product.variants.map(v => ({...v}))
        }
        : {
            name: '',
            description: '',
            category: '',
            variants: [{ color: '', size: '', stock: 0, price: 0, imageUrl: `https://picsum.photos/seed/${Math.random()}/600/600` }],
        };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  async function onSubmit(data: ProductFormValues) {
    setIsSaving(true);
    try {
        if (product) {
            await updateProduct(product.id, data);
             toast({
                title: "Product Updated",
                description: `"${data.name}" has been successfully updated.`,
            });
        } else {
            await addProduct(data);
            toast({
                title: "Product Created",
                description: `"${data.name}" has been successfully created.`,
            });
        }
        router.push('/admin/products');
        router.refresh();
    } catch (error: any) {
        console.error("Failed to save product:", error);
        toast({
            title: "Save Failed",
            description: error.message || "There was a problem saving the product.",
            variant: "destructive"
        });
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                    <Input placeholder="Cyber-Tee" {...field} disabled={isSaving} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                    <Input placeholder="Apparel" {...field} disabled={isSaving} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A stylish t-shirt..." {...field} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Card>
            <CardHeader>
                <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 border p-4 rounded-lg relative">
                        <FormField
                        control={form.control}
                        name={`variants.${index}.color`}
                        render={({ field }) => (
                            <FormItem className="md:col-span-1">
                            <FormLabel>Color</FormLabel>
                            <FormControl><Input placeholder="Black" {...field} disabled={isSaving} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name={`variants.${index}.size`}
                        render={({ field }) => (
                            <FormItem className="md:col-span-1">
                            <FormLabel>Size</FormLabel>
                            <FormControl><Input placeholder="M" {...field} disabled={isSaving} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name={`variants.${index}.price`}
                        render={({ field }) => (
                            <FormItem className="md:col-span-1">
                            <FormLabel>Price</FormLabel>
                            <FormControl><Input type="number" step="0.01" placeholder="29.99" {...field} disabled={isSaving} /></FormControl>
                             <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name={`variants.${index}.stock`}
                        render={({ field }) => (
                            <FormItem className="md:col-span-1">
                            <FormLabel>Stock</FormLabel>
                            <FormControl><Input type="number" placeholder="15" {...field} disabled={isSaving} /></FormControl>
                             <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name={`variants.${index}.imageUrl`}
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                            <FormLabel>Image URL</FormLabel>
                            <FormControl><Input placeholder="https://..." {...field} disabled={isSaving} /></FormControl>
                             <FormMessage />
                            </FormItem>
                        )}
                        />
                        {fields.length > 1 && (
                            <Button type="button" variant="ghost" size="icon" className="absolute -top-3 -right-3 h-7 w-7 bg-background" onClick={() => remove(index)} disabled={isSaving}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ color: '', size: '', stock: 0, price: 0, imageUrl: `https://picsum.photos/seed/${Math.random()}/600/600` })}
                    disabled={isSaving}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Variant
                </Button>
            </CardContent>
        </Card>

        <Button type="submit" size="lg" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving...' : product ? 'Save Changes' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}
