
'use client';

import { useCart } from '@/context/CartProvider';
import { Button } from '@/components/ui/button';
import { SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Separator } from './ui/separator';
import Link from 'next/link';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-primary sr-only">My Cart</SheetTitle>
        <h2 className="text-lg font-semibold">My Cart ({totalItems})</h2>
      </SheetHeader>
      {cart.length > 0 ? (
        <div className="flex h-full flex-col justify-between">
            <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="mt-8 flex flex-col gap-6">
                {cart.map((item) => (
                    <div key={item.variantId} className="flex items-start gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <Image src={item.imageUrl} alt={item.name} fill objectFit="cover" data-ai-hint="product image" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                        {item.color} / {item.size}
                        </p>
                        <p className="mt-1 font-bold text-primary">${item.price.toFixed(2)}</p>
                        <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-md border">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => removeFromCart(item.variantId)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </ScrollArea>
            <SheetFooter className="mt-auto">
                <div className="w-full space-y-4">
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <Link href="/checkout" className="w-full">
                        <Button className="w-full" size="lg">
                            Proceed to Checkout
                        </Button>
                    </Link>
                </div>
          </SheetFooter>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <ShoppingBag className="h-24 w-24 text-muted" />
          <h3 className="text-xl font-semibold">Your cart is empty</h3>
          <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        </div>
      )}
    </>
  );
}
