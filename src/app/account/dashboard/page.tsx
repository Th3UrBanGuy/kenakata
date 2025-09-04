
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, User, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { orders } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const recentOrders = orders.slice(0, 3);

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="p-6 rounded-lg bg-card shadow-sm">
                <h1 className="text-3xl font-bold font-headline text-primary">Welcome back, Demo User!</h1>
                <p className="text-muted-foreground mt-1">Here's a quick look at your account.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-primary/10 to-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">4</div>
                        <p className="text-xs text-muted-foreground">Across all time</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-secondary/20 to-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Items Purchased</CardTitle>
                        <Package className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">12</div>
                         <p className="text-xs text-muted-foreground">In your order history</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-accent/20 to-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                        <User className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-400">Active</div>
                        <p className="text-xs text-muted-foreground">Member since 2024</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex items-center justify-between flex-row">
                    <CardTitle className="font-headline">Recent Orders</CardTitle>
                    <Link href="/account/orders">
                        <Button variant="ghost" size="sm">
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                   <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id.slice(-6).toUpperCase()}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{order.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
