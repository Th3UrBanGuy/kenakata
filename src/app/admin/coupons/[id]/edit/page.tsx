
'use client';
import { notFound, useParams } from "next/navigation";
import { CouponForm } from "@/components/admin/CouponForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/context/DataProvider";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";

export default function EditCouponPage() {
    const params = useParams();
    const { id } = params;
    const { coupons, isLoading } = useData();

    const coupon = useMemo(() => coupons.find(c => c.id === id), [coupons, id]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
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
