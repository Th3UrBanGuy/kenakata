
'use client';

import Link from "next/link";
import { Home, Menu, Package, Package2, ShoppingCart, Users, LineChart, Tag, Heart, User, LogOut, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthProvider";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";


const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/toolbox", label: "Toolbox", icon: Wrench },
];

const pageTitles: { [key: string]: string } = {
    '/admin/dashboard': 'Dashboard',
    '/admin/products': 'Products',
    '/admin/orders': 'Orders',
    '/admin/customers': 'Customers',
    '/admin/coupons': 'Coupons',
    '/admin/wishlist': 'Wishlist Activity',
    '/admin/analytics': 'Analytics',
    '/admin/toolbox': 'Toolbox',
    '/admin': 'Admin',
}

export function AdminMobileHeader() {
    const { logout } = useAuth();
    const pathname = usePathname();
    
    const getTitle = () => {
        if (pathname.startsWith('/admin/products/new')) return 'Add New Product';
        if (pathname.includes('/edit')) return 'Edit';
        if (pathname.startsWith('/admin/coupons/new')) return 'Add New Coupon';
        if (pathname.includes('/analytics')) return 'Analytics';

        return pageTitles[pathname] || 'Admin';
    }

    return (
         <header className="flex h-14 items-center justify-between gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
            <div className="flex-1">
                 <h1 className="font-semibold text-lg">{getTitle()}</h1>
            </div>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/" passHref>
                <DropdownMenuItem>View Store</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
    )
}
