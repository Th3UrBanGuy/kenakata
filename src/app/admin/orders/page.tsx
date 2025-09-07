
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { Order } from "@/lib/types";
import { useData } from "@/context/DataProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";


export default function OrdersPage() {
    const { orders, isLoading } = useData();
    const router = useRouter();

    const getStatusVariant = (status: Order['status']) => {
        switch (status) {
            case 'Pending': return 'default';
            case 'Shipped': return 'secondary';
            case 'Delivered': return 'outline';
            case 'Cancelled': return 'destructive';
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl font-headline">Orders</h1>
                    <p className="text-muted-foreground text-sm">View and manage all customer orders.</p>
                </div>
            </div>
             <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="hidden md:table-cell">Date</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && orders.length === 0 ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                        <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((order) => (
                                    <TableRow key={order.id} className="cursor-pointer" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                                        <TableCell className="font-medium">{order.id.slice(-6).toUpperCase()}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.customerName}</div>
                                            <div className="text-sm text-muted-foreground hidden md:block">{order.customerEmail}</div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge variant={getStatusVariant(order.status)} className="capitalize">{order.status}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{new Date(order.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                                        <MoreHorizontal className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <Link href={`/admin/orders/${order.id}`}>
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    </Link>
                                                    <Link href={`mailto:${order.customerEmail}`}>
                                                        <DropdownMenuItem>Contact Customer</DropdownMenuItem>
                                                    </Link>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
        </div>
    )
}
