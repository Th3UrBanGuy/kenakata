
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const from = searchParams.get('from') || '/admin/dashboard';

  useEffect(() => {
    login('admin');
    const timer = setTimeout(() => {
        router.push(from);
    }, 1000); 

    return () => clearTimeout(timer);
  }, [router, login, from]);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center container py-12 md:py-24">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Admin Login</CardTitle>
            <CardDescription>
              Please wait while we log you in...
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
