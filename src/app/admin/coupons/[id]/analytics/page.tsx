
'use client';

import { useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import { coupons, couponUsage, orders } from '@/lib/data';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { DollarSign, Percent, User, Hash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function CouponAnalyticsPage() {
  const params = useParams();
  const { id } = params;
  const coupon = coupons.find(c => c.id === id);

  const usageData = useMemo(() => {
    return couponUsage.filter(u => u.couponCode === coupon?.code);
  }, [coupon]);

  const chartData = useMemo(() => {
    const dailyUsage: { [key: string]: number } = {};
    usageData.forEach(usage => {
      const date = new Date(usage.usageDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyUsage[date] = (dailyUsage[date] || 0) + 1;
    });
    return Object.entries(dailyUsage).map(([date, count]) => ({ date, count }));
  }, [usageData]);

  const totalDiscount = useMemo(() => {
    return usageData.reduce((sum, u) => sum + u.discountAmount, 0);
  }, [usageData]);

  if (!coupon) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <CardTitle className="font-headline text-2xl md:text-3xl">Analytics for "{coupon.code}"</CardTitle>
              <CardDescription>A detailed look at how this coupon is performing.</CardDescription>
            </div>
            <Badge variant="outline" className="text-base w-fit">
              {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `$${coupon.discountValue.toFixed(2)} OFF`}
            </Badge>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uses</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coupon.claims || 0} / {coupon.maxClaims || '∞'}</div>
            <p className="text-xs text-muted-foreground">Number of times claimed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Discount Given</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDiscount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total value given to customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{[...new Set(usageData.map(u => u.customerEmail))].length}</div>
            <p className="text-xs text-muted-foreground">Number of unique customers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[250px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Detailed Usage Log</CardTitle>
            <CardDescription>A list of every order that used this coupon.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right">Discount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {usageData.map(usage => (
                        <TableRow key={usage.orderId}>
                            <TableCell className="font-medium">
                                <Link href={`/admin/orders`}>
                                    <span className="hover:underline">{usage.orderId.slice(-6).toUpperCase()}</span>
                                </Link>
                            </TableCell>
                            <TableCell className="truncate max-w-[150px] sm:max-w-none">
                                <Link href={`/admin/customers/${encodeURIComponent(usage.customerEmail)}`}>
                                    <span className="hover:underline">{usage.customerEmail}</span>
                                </Link>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{new Date(usage.usageDate).toLocaleString()}</TableCell>
                            <TableCell className="text-right">${usage.discountAmount.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
             </Table>
        </CardContent>
      </Card>
    </div>
  );
}
