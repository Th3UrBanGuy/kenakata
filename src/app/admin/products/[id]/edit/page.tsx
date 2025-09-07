
'use client';
import { notFound, useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { useData } from "@/context/DataProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function EditProductPageSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-24 w-full" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-32" />
                    </CardContent>
                </Card>
                <Skeleton className="h-12 w-40" />
            </CardContent>
        </Card>
    );
}

export default function EditProductPage() {
    const params = useParams();
    const { id } = params;
    const { products, isLoading } = useData();
    
    const product = useMemo(() => products.find(p => p.id === id), [products, id]);

    if (isLoading && !product) {
        return <EditProductPageSkeleton />;
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
