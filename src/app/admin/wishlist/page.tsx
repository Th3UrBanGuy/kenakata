
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { userWishlist } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl font-headline">Wishlisted Products</h1>
                    <p className="text-muted-foreground">A list of products users have added to their wishlists.</p>
                </div>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Wishlist Activity</CardTitle>
                    <CardDescription>Track which products are most popular among users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Variant</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userWishlist.map((item) => (
                                <TableRow key={`${item.user}-${item.variantId}`}>
                                    <TableCell className="font-medium">{item.user}</TableCell>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell className="capitalize">{item.variant}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/product/${item.productId}`}>
                                            <Button variant="outline" size="sm">View Product</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
        </div>
    )
}
