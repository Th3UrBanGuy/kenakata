
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { User, Shield } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center container py-12 md:py-24">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Developer Login</CardTitle>
            <CardDescription>
              Please select a login type for development.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/login/admin" className='w-full block'>
                <Button className="w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Login
                </Button>
            </Link>
            <Link href="/login/user" className='w-full block'>
                <Button variant="secondary" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Demo User Login
                </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
