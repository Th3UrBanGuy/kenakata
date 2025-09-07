
'use client';
import { notFound, useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { useData } from "@/context/DataProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";

export default function EditProductPage() {
    const params = useParams();
    const { id } = params;
    const { products, isLoading } = useData();
    
    const product = useMemo(() => products.find(p => p.id === id), [products, id]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!product) {
        notFound();
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
