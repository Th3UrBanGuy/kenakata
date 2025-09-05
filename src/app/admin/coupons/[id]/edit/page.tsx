
'use client';
import { notFound, useParams } from "next/navigation";
import { CouponForm } from "@/components/admin/CouponForm";
import { coupons } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditCouponPage() {
    const params = useParams();
    const { id } = params;
    const coupon = coupons.find(p => p.id === id);

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
