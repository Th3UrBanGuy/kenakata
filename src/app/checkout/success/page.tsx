
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useData } from '@/context/DataProvider';
import type { Order } from '@/lib/types';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { orders, isLoading } = useData();

  const order: Order | undefined = orders.find(o => o.id === orderId);

  if (isLoading || !order) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-semibold">Loading order details...</h2>
      </div>
    )
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.00;
  // Note: Tax calculation might be different in a real app (e.g. post-discount)
  const taxes = subtotal * 0.08; 

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="items-center text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <CardTitle className="text-3xl font-bold font-headline">Order Confirmed!</CardTitle>
        <CardDescription>Thank you for your purchase. Your order is being processed.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-md bg-muted/50">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <p className="text-sm text-muted-foreground">Order #{order.id.slice(-6).toUpperCase()}</p>
            <p className="text-sm text-muted-foreground">Date: {new Date(order.date).toLocaleDateString()}</p>
        </div>
        
        <div className="space-y-4">
            {order.items.map(item => (
                 <div key={item.variantId} className="flex justify-between items-center">
                    <div>
                        <p className="font-medium">{item.name} ({item.color}, {item.size})</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            ))}
        </div>
        
        <Separator />

        <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
             {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-500">
                    <span className="flex items-center gap-2">
                        Coupon "{order.couponCode}"
                    </span>
                    <span>-${order.discountAmount.toFixed(2)}</span>
                </div>
            )}
            <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes</span>
                <span>${taxes.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
                <span>Total Paid</span>
                <span>${order.total.toFixed(2)}</span>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
                <h4 className="font-semibold mb-1">Shipping To</h4>
                <address className="not-italic text-muted-foreground">
                    {order.customerName}<br/>
                    {/* In a real app, this would come from the order shipping details */}
                    123 Tech Lane<br/>
                    Webville, CA 90210
                </address>
            </div>
              <div>
                <h4 className="font-semibold mb-1">Billed To</h4>
                <p className="text-muted-foreground">
                    {order.paymentMethod} ending in 1234
                </p>
            </div>
        </div>

      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}


export default function CheckoutSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12 md:py-24 flex items-center justify-center">
        <Suspense fallback={<div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
          <CheckoutSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
