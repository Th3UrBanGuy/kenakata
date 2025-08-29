import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function CheckoutSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12 md:py-24 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="items-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-3xl font-bold font-headline">Order Confirmed!</CardTitle>
            <CardDescription>Thank you for your purchase. Your order is being processed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-md bg-muted/50">
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <p className="text-sm text-muted-foreground">Order #12345</p>
                <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium">Cyber-Tee (Black, M)</p>
                        <p className="text-sm text-muted-foreground">Qty: 1</p>
                    </div>
                    <p className="font-medium">$29.99</p>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium">Nova Hoodie (Gray, L)</p>
                        <p className="text-sm text-muted-foreground">Qty: 1</p>
                    </div>
                    <p className="font-medium">$59.99</p>
                </div>
            </div>
            
            <Separator />

            <div className="space-y-2">
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>$89.98</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>$5.00</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>$7.20</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total Paid</span>
                    <span>$102.18</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <h4 className="font-semibold mb-1">Shipping To</h4>
                    <address className="not-italic text-muted-foreground">
                        John Doe<br/>
                        123 Main St<br/>
                        Anytown, CA 12345
                    </address>
                </div>
                 <div>
                    <h4 className="font-semibold mb-1">Billed To</h4>
                    <p className="text-muted-foreground">
                        Visa ending in 1234
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
      </main>
      <Footer />
    </div>
  );
}
