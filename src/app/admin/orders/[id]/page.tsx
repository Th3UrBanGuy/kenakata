
'use client';

import { useParams, notFound } from 'next/navigation';
import { useData } from '@/context/DataProvider';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/lib/types';
import { DollarSign, Hash, ShoppingCart, Truck, CheckCircle, Package, User, Mail, Phone, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';


export default function OrderDetailPage() {
    const params = useParams();
    const { id: orderId } = params;
    const { orders, users, updateOrderStatus } = useData();
    const { toast } = useToast();
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const order = useMemo(() => orders.find(o => o.id === orderId), [orders, orderId]);
    
    const customer = useMemo(() => {
        if (!order) return null;
        return users.find(u => u.uid === order.customerUid);
    }, [users, order]);

    const handleStatusChange = async (newStatus: Order['status']) => {
        if (!order) return;
        setIsUpdatingStatus(true);
        try {
            await updateOrderStatus(order.id, newStatus);
            toast({
                title: "Status Updated",
                description: `Order status changed to ${newStatus}.`
            });
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message,
                variant: 'destructive'
            });
        } finally {
            setIsUpdatingStatus(false);
        }
    };
    
    const getStatusInfo = (status: Order['status']) => {
        switch (status) {
            case 'Pending': return { icon: Package, color: 'text-yellow-500', label: 'Pending' };
            case 'Shipped': return { icon: Truck, color: 'text-blue-500', label: 'Shipped' };
            case 'Delivered': return { icon: CheckCircle, color: 'text-green-500', label: 'Delivered' };
            case 'Cancelled': return { icon: Package, color: 'text-red-500', label: 'Cancelled' };
            default: return { icon: Package, color: 'text-muted-foreground', label: 'Unknown' };
        }
    };


    if (!order) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Order not found.</p>
            </div>
        )
    }
    
    const { icon: StatusIcon, color: statusColor, label: statusLabel } = getStatusInfo(order.status);
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-headline">Order #{order.id.slice(-6).toUpperCase()}</CardTitle>
                            <CardDescription>
                                Placed on {new Date(order.date).toLocaleString()}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 font-semibold">
                                <StatusIcon className={`h-6 w-6 ${statusColor}`} />
                                <span className={statusColor}>{statusLabel}</span>
                            </div>
                             <Select onValueChange={(value: Order['status']) => handleStatusChange(value)} defaultValue={order.status} disabled={isUpdatingStatus}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Update status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Shipped">Shipped</SelectItem>
                                    <SelectItem value="Delivered">Delivered</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map(item => (
                                    <TableRow key={item.variantId}>
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded-md" data-ai-hint="product photo" />
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground capitalize">{item.color} / {item.size}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">x{item.quantity}</TableCell>
                                        <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex flex-col items-end gap-2 bg-muted/50 p-6">
                        <div className="flex justify-between w-full max-w-xs">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {order.discountAmount && order.discountAmount > 0 && (
                             <div className="flex justify-between w-full max-w-xs text-green-600">
                                <span className="text-muted-foreground">Discount ({order.couponCode})</span>
                                <span>-${order.discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between w-full max-w-xs">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>$5.00</span>
                        </div>
                         <div className="flex justify-between w-full max-w-xs">
                            <span className="text-muted-foreground">Taxes</span>
                            <span>${(subtotal * 0.08).toFixed(2)}</span>
                        </div>
                        <Separator className="my-2 max-w-xs" />
                         <div className="flex justify-between w-full max-w-xs font-bold text-lg">
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                             <Avatar>
                                <AvatarImage src={`https://avatar.vercel.sh/${order.customerEmail}.png`} />
                                <AvatarFallback>{order.customerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{order.customerName}</p>
                                <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                            </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                            <h4 className="font-semibold mb-2">Contact Information</h4>
                            <div className="space-y-2">
                                <a href={`mailto:${order.customerEmail}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                                    <Mail className="h-4 w-4" /> {order.customerEmail}
                                </a>
                                {customer?.phone && (
                                     <a href={`tel:${customer.phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                                        <Phone className="h-4 w-4" /> {customer.phone}
                                    </a>
                                )}
                            </div>
                        </div>
                        
                         <Separator />

                        {customer && (
                             <Link href={`/admin/customers/${customer.uid}`}>
                                <Button variant="outline" className="w-full">
                                    <User className="mr-2 h-4 w-4" /> View Customer Profile <ExternalLink className="ml-auto h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
