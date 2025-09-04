
import { CouponForm } from "@/components/admin/CouponForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewCouponPage() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Add New Coupon</CardTitle>
                    <CardDescription>Fill out the form below to add a new coupon to your store.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CouponForm />
                </CardContent>
            </Card>
        </div>
    );
}
