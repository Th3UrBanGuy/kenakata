
'use client';
import { notFound, useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { useData } from "@/context/DataProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

export default function EditProductPage() {
    const params = useParams();
    const { id } = params;
    const { products } = useData();
    
    const product = useMemo(() => products.find(p => p.id === id), [products, id]);

    if (!product) {
        // You can return a loading state or null while waiting for data
        return <div>Loading...</div>;
    }
    
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Edit Product</CardTitle>
                    <CardDescription>Update the details for "{product.name}".</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductForm product={product} />
                </CardContent>
            </Card>
        </div>
    );
}
