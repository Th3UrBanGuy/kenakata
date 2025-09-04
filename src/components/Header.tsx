
'use client';

import Link from 'next/link';
import { LogIn, LogOut, Package2, Search, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Cart } from '@/components/Cart';
import { useCart } from '@/context/CartProvider';
import { useAuth } from '@/context/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { totalItems } = useCart();
  const { isAuthenticated, logout, role } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Package2 className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">KenaKata</span>
              </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md items-center gap-4">
            <form className="w-full">
                <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="What are you looking for?"
                    className="w-full rounded-full bg-muted pl-10"
                />
                </div>
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {totalItems}
                    </span>
                  )}
                  <span className="sr-only">Open Cart</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetTitle className="sr-only">Shopping Cart</SheetTitle>
                <Cart />
              </SheetContent>
            </Sheet>
            
            {isAuthenticated ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href={role === 'admin' ? '/admin/dashboard' : '/account/dashboard'} passHref>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/account/profile" passHref>
                     <DropdownMenuItem>
                        Profile
                    </DropdownMenuItem>
                  </Link>
                   <Link href="/account/orders" passHref>
                    <DropdownMenuItem>Orders</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" passHref>
                <Button>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="md:hidden pb-4">
            <form>
                <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="What are you looking for?"
                    className="w-full rounded-full bg-muted pl-10"
                />
                </div>
            </form>
        </div>
      </div>
    </header>
  );
}
