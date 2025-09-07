'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/account/dashboard';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            toast({ title: "Login Successful", description: "Welcome back!" });
            router.push(from);
        } catch (error: any) {
            console.error("Login failed:", error);
            toast({ title: "Login Failed", description: error.message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const fillAdminCreds = () => {
        setEmail('mrash541@gmail.com');
        setPassword('Ra726ma@#$');
    }
    
    const fillUserCreds = () => {
        setEmail('ra726ma@gmail.com');
        setPassword('726268');
    }

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <Card className="mx-auto grid w-[380px] gap-6 border-0 shadow-none sm:border-solid sm:shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold font-headline">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <form onSubmit={handleLogin} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="#"
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Login
                            </Button>
                        </form>
                        
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="underline">
                                Sign up
                            </Link>
                        </div>
                        
                        <div className="space-y-4 pt-4">
                            <Separator />
                            <p className="text-center text-xs text-muted-foreground">For Demo Purposes</p>
                            <div className="flex gap-2">
                                <Button variant="secondary" className="w-full" onClick={fillAdminCreds}>Login as Admin</Button>
                                <Button variant="secondary" className="w-full" onClick={fillUserCreds}>Login as User</Button>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
            <div className="hidden bg-muted lg:block relative">
                <Image
                    src="https://picsum.photos/1200/1800"
                    alt="Image"
                    width="1200"
                    height="1800"
                    className="h-full w-full object-cover dark:brightness-[0.3]"
                    data-ai-hint="fashion lifestyle"
                />
                 <div className="absolute top-0 left-0 h-full w-full flex items-end p-12">
                    <div className="text-white">
                        <h2 className="text-4xl font-bold font-headline">Discover a New Way to Shop</h2>
                        <p className="text-lg mt-4">Join our community and get access to exclusive deals, new arrivals, and much more.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
