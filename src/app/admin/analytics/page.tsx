
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { useData } from '@/context/DataProvider';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const chartConfig: ChartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
  clothing: {
    label: 'Apparel',
    color: 'hsl(var(--chart-1))',
  },
  accessories: {
    label: 'Accessories',
    color: 'hsl(var(--chart-2))',
  },
  gadgets: {
    label: 'Gadgets',
    color: 'hsl(var(--chart-3))',
  },
  footwear: {
    label: 'Footwear',
    color: 'hsl(var(--chart-4))',
  },
};

export default function AnalyticsPage() {
  const { products, orders } = useData();

  const monthlySales = useMemo(() => {
    const salesByMonth: { [key: string]: number } = {};
    orders.forEach(order => {
      const month = new Date(order.date).toLocaleString('default', { month: 'long' });
      salesByMonth[month] = (salesByMonth[month] || 0) + order.total;
    });
    return Object.entries(salesByMonth).map(([month, sales]) => ({ month, sales: Math.round(sales) }));
  }, [orders]);
  
  const salesByCategory = useMemo(() => {
    const categorySales: { [key: string]: number } = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if(product) {
                const category = product.category.toLowerCase();
                categorySales[category] = (categorySales[category] || 0) + item.price * item.quantity;
            }
        });
    });
    return Object.entries(categorySales).map(([name, value]) => ({ name: name, value, fill: `var(--color-${name})`}));
  }, [orders, products]);
  
  const topSellingProducts = useMemo(() => {
      const productSales: { [key: string]: { product: any, quantity: number} } = {};
      orders.forEach(order => {
          order.items.forEach(item => {
              if (productSales[item.productId]) {
                  productSales[item.productId].quantity += item.quantity;
              } else {
                  const product = products.find(p => p.id === item.productId);
                  if (product) {
                    productSales[item.productId] = {
                        product: { name: product.name, category: product.category, imageUrl: product.variants[0].imageUrl },
                        quantity: item.quantity
                    };
                  }
              }
          });
      });
      return Object.values(productSales).sort((a,b) => b.quantity - a.quantity).slice(0, 3);
  }, [orders, products]);

  return (
    <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold font-headline">Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your store's performance.</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>A chart showing total sales over the last months.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={monthlySales}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
                 <CardHeader>
                    <CardTitle>Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                     <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                            <Pie data={salesByCategory} dataKey="value">
                                 {salesByCategory.map((entry) => (
                                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                 ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>

             <Card className="lg:col-span-2">
                 <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {topSellingProducts.map(item => (
                        <div key={item.product.name} className="flex items-center gap-4">
                           <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                <Image src={item.product.imageUrl} alt={item.product.name} fill objectFit="cover" data-ai-hint="product photo" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">{item.product.name}</p>
                                <Badge variant="outline">{item.product.category}</Badge>
                            </div>
                            <p className="font-bold">{item.quantity} sold</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
