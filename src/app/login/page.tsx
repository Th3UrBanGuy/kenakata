'use client';

import { useRouter } from 'next/navigation';
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

export default function LoginPage() {
  const router = useRouter();

  const handleAdminLogin = () => {
    router.push('/admin');
  };

  const handleUserLogin = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center container py-12 md:py-24">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Development Login</CardTitle>
            <CardDescription>
              Select a role to log in for development purposes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleAdminLogin} className="w-full">
              <Shield className="mr-2 h-4 w-4" />
              Login as Admin
            </Button>
            <Button onClick={handleUserLogin} variant="secondary" className="w-full">
              <User className="mr-2 h-4 w-4" />
              Login as User
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
