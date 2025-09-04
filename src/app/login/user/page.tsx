
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function UserLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  
  const from = searchParams.get('from') || '/account/dashboard';

  // This is now a developer-only login page.
  // The main login is at /login. We will redirect there.
  // In a real app, this page would likely be removed.
  useEffect(() => {
    router.replace('/login');
  }, [router]);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center container py-12 md:py-24">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Redirecting...</CardTitle>
            <CardDescription>
              This login page has moved. Redirecting you to the new login page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center p-10 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">If you are not redirected, <Link href="/login" className="underline">click here</Link>.</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
