
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
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
import { Loader2, MailCheck, MailWarning } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, isLoading, sendVerificationEmail, reloadUser } = useAuth();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isLoading && user?.emailVerified) {
      toast({ title: "Email Verified!", description: "You can now access all features." });
      router.push('/account/dashboard');
    }
  }, [user, isLoading, router, toast]);

  const handleResendEmail = async () => {
    setIsSending(true);
    try {
      await sendVerificationEmail();
      toast({
        title: "Verification Email Sent",
        description: "A new verification link has been sent to your email address.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Send Email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleCheckVerification = async () => {
      await reloadUser();
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center container py-12 md:py-24">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg">Loading user status...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!user) {
      router.push('/login');
      return null;
  }

  if (user.emailVerified) {
      return (
         <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 flex items-center justify-center container py-12 md:py-24">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2"><MailCheck className="h-8 w-8 text-green-500"/> Email Verified!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Redirecting you to your dashboard...</p>
                        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
      )
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center container py-12 md:py-24">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <MailWarning className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-2xl font-headline mt-4">Please Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a verification link to <strong>{user.email}</strong>. Please check your inbox and click the link to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">After verifying, click the button below to continue.</p>
              <Button onClick={handleCheckVerification} size="lg" className="w-full">
                  I've Verified My Email
              </Button>
            <Separator />
            <div className="space-y-2">
                 <p className="text-sm text-muted-foreground">Didn't receive an email?</p>
                <Button variant="secondary" onClick={handleResendEmail} disabled={isSending}>
                    {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Resend Verification Email
                </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
