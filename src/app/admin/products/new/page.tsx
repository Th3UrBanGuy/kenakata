
import { ProductForm } from "@/components/admin/ProductForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewProductPage() {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Add New Product</CardTitle>
                    <CardDescription>Fill out the form below to add a new product to your store.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductForm />
                </CardContent>
            </Card>
        </div>
    );
}
