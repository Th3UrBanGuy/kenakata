
'use client';

import { useCart } from '@/context/CartProvider';
import { Button } from '@/components/ui/button';
import { SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { Input } from './ui/input';
import { useState } from 'react';

export function Cart() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    totalItems, 
    subtotal, 
    discount,
    total,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    isApplyingCoupon
  } = useCart();
  const { role } = useAuth();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
      setCouponCode('');
    }
  }

  return (
    <div className="flex h-full flex-col">
      <SheetHeader>
        <SheetTitle className="text-primary sr-only">My Cart</SheetTitle>
        <h2 className="text-2xl font-semibold font-headline">My Cart ({totalItems})</h2>
      </SheetHeader>
      {cart.length > 0 ? (
        <>
            <ScrollArea className="flex-1 pr-4 -mr-6 my-6">
                <div className="flex flex-col gap-6">
                {cart.map((item) => (
                    <div key={item.variantId} className="flex items-start gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image src={item.imageUrl} alt={item.name} fill objectFit="cover" data-ai-hint="product image" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-base">{item.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                        {item.color} / {item.size}
                        </p>
                        <p className="mt-1 font-bold text-primary text-lg">${item.price.toFixed(2)}</p>
                        <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-md border">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.variantId)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </ScrollArea>
            <SheetFooter className="mt-auto p-0">
                <div className="w-full space-y-4 pt-6 border-t">
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Coupon Code" 
                            value={couponCode} 
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            disabled={isApplyingCoupon || !!appliedCoupon}
                        />
                        <Button onClick={handleApplyCoupon} disabled={!couponCode || isApplyingCoupon || !!appliedCoupon}>
                            {isApplyingCoupon && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Apply
                        </Button>
                    </div>

                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {appliedCoupon && (
                            <div className="flex justify-between text-green-500">
                                <span className="flex items-center gap-2">
                                    Coupon "{appliedCoupon.code}"
                                    <button onClick={removeCoupon} className="text-destructive"><XCircle className="h-4 w-4"/></button>
                                </span>
                                <span>-${discount.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-between font-bold text-xl border-t pt-4">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    {role !== 'admin' && (
                        <Link href="/checkout" className="w-full">
                            <Button className="w-full" size="lg">
                                Proceed to Checkout
                            </Button>
                        </Link>
                    )}
                </div>
          </SheetFooter>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <ShoppingBag className="h-24 w-24 text-muted" />
          <h3 className="text-xl font-semibold">Your cart is empty</h3>
          <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        </div>
      )}
    </div>
  );
}
