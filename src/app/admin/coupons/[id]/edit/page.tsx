
'use client';
import { notFound, useParams } from "next/navigation";
import { CouponForm } from "@/components/admin/CouponForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/DataProvider";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function EditCouponPageSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                </div>
                 <Skeleton className="h-10 w-1/3" />
                <div className="grid md:grid-cols-2 gap-8">
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-10 w-full" />
                </div>
                 <Skeleton className="h-24 w-full" />
                 <Skeleton className="h-12 w-40" />
            </CardContent>
        </Card>
    )
}

export default function EditCouponPage() {
    const params = useParams();
    const { id } = params;
    const { coupons, isLoading } = useData();

    const coupon = useMemo(() => coupons.find(c => c.id === id), [coupons, id]);

    if (isLoading && !coupon) {
        return <EditCouponPageSkeleton />;
    }

    if (!coupon) {
        notFound();
    }
    
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Edit Coupon</CardTitle>
                    <CardDescription>Update the details for "{coupon.code}".</CardDescription>
                </CardHeader>
                <CardContent>
                    <CouponForm coupon={coupon} />
                </CardContent>
            </Card>
        </div>
    );
}
