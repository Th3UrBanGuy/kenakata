
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/lib/types";
import { useData } from "@/context/DataProvider";

export default function AccountOrdersPage() {
    const { orders } = useData();
    
    const getStatusVariant = (status: Order['status']) => {
        switch (status) {
            case 'Pending': return 'default';
            case 'Shipped': return 'secondary';
            case 'Delivered': return 'outline';
            case 'Cancelled': return 'destructive';
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">My Orders</CardTitle>
                <CardDescription>View the history of all your purchases.</CardDescription>
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
                        {[...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((order) => (
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
    )
}
