
'use client';

import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Users,
  Tag,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const tools = [
  { href: '/admin/products', label: 'Products', icon: Package, description: 'Manage product details and variants' },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, description: 'View and process customer orders' },
  { href: '/admin/customers', label: 'Customers', icon: Users, description: 'Manage all registered users' },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag, description: 'Create and manage promotional codes' },
  { href: '/admin/wishlist', label: 'Wishlist', icon: Heart, description: 'See what products users are loving' },
];

export default function ToolboxPage() {
  return (
    <div className="space-y-6">
       <div className="flex flex-col">
          <h1 className="text-3xl font-bold font-headline">Toolbox</h1>
          <p className="text-muted-foreground">All your store management tools in one place.</p>
        </div>
       <Card>
            <CardHeader>
                <CardTitle>Management Tools</CardTitle>
                <CardDescription>Click a tool to navigate to its management page.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool) => (
                    <Link href={tool.href} key={tool.href} className="block group">
                        <div className="flex items-center gap-4 rounded-lg p-4 text-left transition-all hover:bg-accent border h-full active:scale-[0.98]">
                            <div className="rounded-lg bg-muted p-3 group-hover:bg-primary/20 transition-colors">
                                <tool.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">{tool.label}</p>
                                <p className="text-sm text-muted-foreground">{tool.description}</p>
                            </div>
                             <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}
            </CardContent>
       </Card>
    </div>
  );
}
