
'use client';

import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Users,
  Tag,
  Heart,
  LineChart,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const tools = [
  { href: '/admin/products', label: 'Products', icon: Package, description: 'Manage product details and variants' },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, description: 'View and process customer orders' },
  { href: '/admin/customers', label: 'Customers', icon: Users, description: 'Manage all registered users' },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag, description: 'Create and manage promotional codes' },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare, description: 'Interact with user support tickets' },
  { href: '/admin/wishlist', label: 'Wishlist', icon: Heart, description: 'See what products users are loving' },
  { href: '/admin/analytics', label: 'Analytics', icon: LineChart, description: 'Analyze your store performance' },
];

export default function ToolboxPage() {
  return (
    <div className="space-y-6">
       <Card>
            <CardHeader>
                <CardTitle className="font-headline">Toolbox</CardTitle>
                <CardDescription>All your store management tools in one place.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {tools.map((tool) => (
                    <Link href={tool.href} key={tool.href}>
                        <div className="flex items-center gap-4 rounded-lg p-3 text-left transition-all hover:bg-accent active:scale-[0.98]">
                            <div className="rounded-lg bg-muted p-3">
                                <tool.icon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">{tool.label}</p>
                                <p className="text-sm text-muted-foreground">{tool.description}</p>
                            </div>
                             <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </Link>
                ))}
            </CardContent>
       </Card>
    </div>
  );
}
