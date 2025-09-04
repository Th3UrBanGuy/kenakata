
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function UserLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // In a real app, you'd have authentication logic here.
    // For dev purposes, we are redirecting immediately.
    const timer = setTimeout(() => {
        router.push('/');
    }, 1000); // A small delay to show the logging in message

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center container py-12 md:py-24">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Logging In</CardTitle>
            <CardDescription>
              Please wait while we log you in as a demo user...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
