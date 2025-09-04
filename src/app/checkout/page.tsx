
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function CheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12 md:py-24">
        <div className="mx-auto max-w-3xl space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold font-headline">Checkout</h1>
                <p className="text-muted-foreground mt-2">Complete your purchase</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                    <CardDescription>Enter the address where you want to receive your order.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" placeholder="John" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" placeholder="Doe" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" placeholder="123 Main St" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="Anytown" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" placeholder="CA" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input id="zip" placeholder="12345" />
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                        <span>$119.98</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>$5.00</span>
                    </div>
                    <Separator/>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>$124.98</span>
                    </div>
                </CardContent>
            </Card>

            <Link href="/checkout/success">
                <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Place Order
                </Button>
            </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
