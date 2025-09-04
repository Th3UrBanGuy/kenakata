'use client';

import Link from 'next/link';
import { LogIn, Package2, Search, ShoppingBag, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Cart } from '@/components/Cart';
import { useCart } from '@/context/CartProvider';

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 flex flex-col border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">KenaKata</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link href="/admin" className="text-muted-foreground transition-colors hover:text-primary">
                    Admin
                </Link>
            </nav>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:block flex-1 max-w-xs">
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
          <Link href="/login" passHref>
            <Button variant="ghost" size="icon">
              <LogIn className="h-5 w-5" />
              <span className="sr-only">Login</span>
            </Button>
          </Link>
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
           <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span className="">KenaKata</span>
                        </Link>
                        <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                            Admin
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
      </div>
      <div className="md:hidden border-t px-4 py-2">
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
    </header>
  );
}
