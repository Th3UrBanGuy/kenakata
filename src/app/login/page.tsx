
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/account/dashboard';

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Simulate a user login for now
        login('user');
        router.push(from);
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <Card className="mx-auto grid w-[350px] gap-6 border-0 shadow-none sm:border-solid sm:shadow-sm">
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
                                    defaultValue="demo@example.com"
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
                                <Input id="password" type="password" required defaultValue="password" />
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </form>
                        <Button variant="outline" className="w-full">
                            Login with Google
                        </Button>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="underline">
                                Sign up
                            </Link>
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
