
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/context/DataProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function CustomersPage() {
    const { orders } = useData();
    
    // Placeholder data using unique customers from orders
    const customers = useMemo(() => Array.from(new Set(orders.map(o => o.customerEmail)))
        .map(email => {
            const customerOrders = orders.filter(o => o.customerEmail === email);
            const latestOrder = customerOrders.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
            return {
                id: encodeURIComponent(email), // Use email as unique id
                name: latestOrder.customerName,
                email: latestOrder.customerEmail,
                role: 'Customer', // Placeholder
                createdAt: new Date(latestOrder.date).toLocaleDateString(), // Use first order date as created date
                orderCount: customerOrders.length
            };
        }), [orders]);


    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl font-headline">Customers</h1>
                    <p className="text-muted-foreground">View and manage all registered users.</p>
                </div>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>A list of all users in your store.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Orders</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium">{customer.name}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={customer.role === 'Admin' ? 'default' : 'secondary'}>{customer.role}</Badge>
                                    </TableCell>
                                    <TableCell>{customer.orderCount}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <Link href={`/admin/customers/${customer.id}`}>
                                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem>Make Admin</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
