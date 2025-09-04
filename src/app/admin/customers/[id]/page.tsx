
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

export default function CustomerDetailPage() {
    const params = useParams();
    const { orders } = useData();
    const customerId = decodeURIComponent(params.id as string);

    const customerOrders = useMemo(() => {
        return orders
            .filter(o => o.customerEmail === customerId)
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [orders, customerId]);

    const customer = useMemo(() => {
        if (customerOrders.length === 0) return null;
        const firstOrder = customerOrders[0];
        const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);

        return {
            name: firstOrder.customerName,
            email: firstOrder.customerEmail,
            avatarFallback: firstOrder.customerName.charAt(0),
            totalOrders: customerOrders.length,
            totalSpent,
        };
    }, [customerOrders]);

    if (!customer) {
        notFound();
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
                        <AvatarImage src={`https://avatar.vercel.sh/${customer.email}.png`} />
                        <AvatarFallback>{customer.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="text-3xl font-headline">{customer.name}</CardTitle>
                        <CardDescription>{customer.email}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-muted rounded-lg">
                            <DollarSign className="h-6 w-6 mx-auto text-primary mb-2" />
                            <p className="text-2xl font-bold">${customer.totalSpent.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">Total Spent</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <ShoppingCart className="h-6 w-6 mx-auto text-primary mb-2" />
                            <p className="text-2xl font-bold">{customer.totalOrders}</p>
                            <p className="text-sm text-muted-foreground">Total Orders</p>
                        </div>
                         <div className="p-4 bg-muted rounded-lg">
                            <Hash className="h-6 w-6 mx-auto text-primary mb-2" />
                            <p className="text-xl font-bold truncate">{customerOrders[0]?.id.slice(-8).toUpperCase()}</p>
                            <p className="text-sm text-muted-foreground">Last Order ID</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>A complete list of all orders placed by {customer.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Payment Method</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customerOrders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id.slice(-6).toUpperCase()}</TableCell>
                                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                    </TableCell>
                                     <TableCell>{order.paymentMethod}</TableCell>
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
