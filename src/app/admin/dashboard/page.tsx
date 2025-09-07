
'use client';

import { DollarSign, Users, ShoppingCart, Activity, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataProvider';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';


export default function DashboardPage() {
  const { orders, users, isLoading } = useData();

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [orders]);

  const recentCustomers = useMemo(() => {
    const allCustomers = orders.map(order => ({
      name: order.customerName,
      email: order.customerEmail,
      date: order.date,
    }));
    // Simple way to get unique recent customers
    const uniqueCustomers = Array.from(new Set(allCustomers.map(c => c.email)))
      .map(email => allCustomers.find(c => c.email === email)!)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    return uniqueCustomers;
  }, [orders]);
  
  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);
  const totalSales = useMemo(() => orders.length, [orders]);

  const DashboardSkeleton = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader className="pb-2"><Skeleton className="h-5 w-2/4" /></CardHeader><CardContent><Skeleton className="h-8 w-3/4" /></CardContent></Card>
        <Card><CardHeader className="pb-2"><Skeleton className="h-5 w-2/4" /></CardHeader><CardContent><Skeleton className="h-8 w-3/4" /></CardContent></Card>
        <Card><CardHeader className="pb-2"><Skeleton className="h-5 w-2/4" /></CardHeader><CardContent><Skeleton className="h-8 w-3/4" /></CardContent></Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
            <CardHeader><Skeleton className="h-8 w-3/5" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader><Skeleton className="h-8 w-4/5" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
      </div>
    </div>
  )

  if (isLoading && orders.length === 0 && users.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
          <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
          <p className="text-muted-foreground">A quick overview of your store.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalSales}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{users.length}</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                A list of the most recent orders in your store.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/admin/orders">
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden text-center sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map(order => (
                    <TableRow key={order.id}>
                        <TableCell>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                                {order.customerEmail}
                            </div>
                        </TableCell>
                        <TableCell className="hidden text-center sm:table-cell">
                            <Badge className="text-xs" variant="outline">{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {recentCustomers.map(customer => (
                <div key={customer.email} className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src={`https://avatar.vercel.sh/${customer.email}.png`} alt="Avatar" />
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
