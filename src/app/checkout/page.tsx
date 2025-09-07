
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartProvider';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useData } from '@/context/DataProvider';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';


type CheckoutStep = 'shipping' | 'payment';

export default function CheckoutPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { cart, subtotal, discount, total, clearCart, appliedCoupon } = useCart();
  const { addOrder } = useData();
  const { toast } = useToast();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: ''
  });

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login?from=/checkout');
    } else if (user) {
      setShippingInfo({
        name: user.displayName || '',
        address: '', // These would typically be fetched from a user profile
        city: '',
        state: '',
        zip: '',
        email: user.email || ''
      });
    }
  }, [user, isAuthLoading, router]);
  
  const handlePlaceOrder = async () => {
    if (!user) return;

    const shipping = 5.00;
    const taxes = subtotal * 0.08;

    const newOrder: Omit<Order, 'id' | 'date' | 'status'> = {
      customerUid: user.uid,
      customerName: shippingInfo.name,
      customerEmail: shippingInfo.email,
      total: total + shipping + taxes,
      paymentMethod: 'Credit Card',
      items: cart,
      couponCode: appliedCoupon?.code,
      discountAmount: discount,
    };
    
    try {
        setProcessingStatus("Processing Payment...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setProcessingStatus("Validating Stock...");
        await new Promise(resolve => setTimeout(resolve, 1500));

        setProcessingStatus("Confirming Order...");
        const newOrderId = await addOrder(newOrder);

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
            title: "Order Placed!",
            description: "Your order has been successfully placed.",
        });
        clearCart();
        router.push(`/checkout/success?orderId=${newOrderId}`);
    } catch(error: any) {
        console.error("Failed to place order:", error);
        toast({
            title: "Order Failed",
            description: error.message || "There was an issue placing your order.",
            variant: "destructive"
        })
        setProcessingStatus(null);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center container">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg">Verifying authentication...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0 && !processingStatus) {
      return (
           <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 container py-12 md:py-24 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
                    <p className="text-muted-foreground mt-2">You need to add items to your cart before you can check out.</p>
                    <Link href="/">
                        <Button className="mt-6">Continue Shopping</Button>
                    </Link>
                </div>
              </main>
              <Footer />
            </div>
      )
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12 md:py-24">
        <div className="mx-auto max-w-3xl space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold font-headline">Checkout</h1>
                <p className="text-muted-foreground mt-2">
                    {step === 'shipping' ? 'Step 1: Shipping Details' : 'Step 2: Payment Information'}
                </p>
            </div>

            {step === 'shipping' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Information</CardTitle>
                        <CardDescription>Confirm the address where you want to receive your order.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="full-name">Full Name</Label>
                            <Input id="full-name" placeholder="John Doe" value={shippingInfo.name} onChange={e => setShippingInfo({...shippingInfo, name: e.target.value})} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" placeholder="123 Main St" value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})} />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" placeholder="Anytown" value={shippingInfo.city} onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})}/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input id="state" placeholder="CA" value={shippingInfo.state} onChange={e => setShippingInfo({...shippingInfo, state: e.target.value})}/>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="zip">ZIP Code</Label>
                                <Input id="zip" placeholder="12345" value={shippingInfo.zip} onChange={e => setShippingInfo({...shippingInfo, zip: e.target.value})}/>
                            </div>
                        </div>
                        <Button size="lg" className="w-full mt-4" onClick={() => setStep('payment')}>Continue to Payment</Button>
                    </CardContent>
                </Card>
            )}

            {step === 'payment' && (
                 <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
                            <CardDescription>Enter your payment information.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="card-number">Card Number</Label>
                                <Input id="card-number" placeholder="**** **** **** 1234" />
                            </div>
                             <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input id="expiry" placeholder="MM/YY" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvc">CVC</Label>
                                    <Input id="cvc" placeholder="123" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-500">
                                    <span className="flex items-center gap-2">
                                        Coupon "{appliedCoupon?.code}"
                                    </span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>$5.00</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Taxes</span>
                                <span>${(subtotal * 0.08).toFixed(2)}</span>
                            </div>
                            <Separator/>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${(total + 5 + subtotal * 0.08).toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        <Button size="lg" variant="outline" onClick={() => setStep('shipping')} className="w-full md:w-auto" disabled={!!processingStatus}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Shipping
                        </Button>
                        <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handlePlaceOrder} disabled={!!processingStatus}>
                            {processingStatus ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {processingStatus}
                                </>
                            ) : (
                                'Place Order'
                            )}
                        </Button>
                    </div>
                </>
            )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
