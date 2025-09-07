
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, User, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { useData } from "@/context/DataProvider";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
    const { user } = useAuth();
    const { orders, isLoading } = useData();

    const recentOrders = useMemo(() => {
        if (!orders) return [];
        return [...orders].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0,3)
    }, [orders]);

    const totalItemsPurchased = useMemo(() => {
        if (!orders) return 0;
        return orders.reduce((acc, order) => acc + order.items.length, 0);
    }, [orders]);

    const memberSince = useMemo(() => {
        if (user?.metadata.creationTime) {
            return new Date(user.metadata.creationTime).getFullYear();
        }
        return 'a while';
    }, [user]);

    const DashboardSkeleton = () => (
        <div className="space-y-8">
            <div className="p-6 rounded-lg bg-card shadow-sm">
                <Skeleton className="h-9 w-3/5 mb-2" />
                <Skeleton className="h-5 w-4/5" />
            </div>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card><CardHeader className="pb-2"><Skeleton className="h-5 w-3/4" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
                <Card><CardHeader className="pb-2"><Skeleton className="h-5 w-3/4" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
                <Card><CardHeader className="pb-2"><Skeleton className="h-5 w-3/4" /></CardHeader><CardContent><Skeleton className="h-10 w-1/2" /></CardContent></Card>
            </div>
            <Card>
                <CardHeader>
                     <Skeleton className="h-8 w-2/5" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )

    if (isLoading && orders.length === 0) {
        return <DashboardSkeleton />
    }

    return (
        <div className="space-y-8">
            <div className="p-6 rounded-lg bg-card shadow-sm">
                <h1 className="text-3xl font-bold font-headline text-primary">Welcome back, {user?.displayName || user?.email || 'User'}!</h1>
                <p className="text-muted-foreground mt-1">Here's a quick look at your account.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-gradient-to-br from-primary/10 to-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{orders.length}</div>
                        <p className="text-xs text-muted-foreground">Across all time</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-secondary/20 to-background">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Items Purchased</CardTitle>
                        <Package className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{totalItemsPurchased}</div>
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
                        <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
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
                                <TableHead className="hidden sm:table-cell">Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id.slice(-6).toUpperCase()}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{new Date(order.date).toLocaleDateString()}</TableCell>
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
