
'use client';

import { useParams, notFound } from 'next/navigation';
import { useData } from '@/context/DataProvider';
import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/lib/types';
import { DollarSign, Hash, ShoppingCart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function CustomerDetailSkeleton() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                </CardHeader>
                <CardContent>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-36" />
                    <Skeleton className="h-4 w-72" />
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
}

export default function CustomerDetailPage() {
    const params = useParams();
    const { users, orders, isLoading } = useData();
    const customerId = decodeURIComponent(params.id as string);

    const customer = useMemo(() => {
        return users.find(u => u.uid === customerId || u.email === customerId);
    }, [users, customerId]);

    const customerOrders = useMemo(() => {
        if (!customer) return [];
        return orders
            .filter(o => o.customerUid === customer.uid)
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [orders, customer]);

    const customerStats = useMemo(() => {
        if (!customer) return null;
        const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);

        return {
            name: customer.name || 'N/A',
            email: customer.email,
            avatarFallback: (customer.name || 'U').charAt(0),
            totalOrders: customerOrders.length,
            totalSpent,
        };
    }, [customer, customerOrders]);

    if (isLoading && !customer) {
        return <CustomerDetailSkeleton />
    }

    if (!customer || !customerStats) {
        return notFound();
    }
    
    const getStatusVariant = (status: Order['status']) => {
        switch (status) {
            case 'Pending': return 'default';
            case 'Shipped': return 'secondary';
            case 'Delivered': return 'outline';
            case 'Cancelled': return 'destructive';
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={`https://avatar.vercel.sh/${customerStats.email}.png`} />
                        <AvatarFallback>{customerStats.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-3xl font-headline">{customerStats.name}</CardTitle>
                        <CardDescription>{customerStats.email}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-muted rounded-lg">
                            <DollarSign className="h-6 w-6 mx-auto text-primary mb-2" />
                            <p className="text-2xl font-bold">${customerStats.totalSpent.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">Total Spent</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <ShoppingCart className="h-6 w-6 mx-auto text-primary mb-2" />
                            <p className="text-2xl font-bold">{customerStats.totalOrders}</p>
                            <p className="text-sm text-muted-foreground">Total Orders</p>
                        </div>
                         <div className="p-4 bg-muted rounded-lg">
                            <Hash className="h-6 w-6 mx-auto text-primary mb-2" />
                            <p className="text-xl font-bold truncate">{customerOrders[0]?.id.slice(-8).toUpperCase() || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">Last Order ID</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>A complete list of all orders placed by {customerStats.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead className="hidden md:table-cell">Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Payment Method</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customerOrders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id.slice(-6).toUpperCase()}</TableCell>
                                    <TableCell className="hidden md:table-cell">{new Date(order.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                    </TableCell>
                                     <TableCell className="hidden md:table-cell">{order.paymentMethod}</TableCell>
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
