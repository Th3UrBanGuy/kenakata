
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
    const { login } = useAuth();
    const router = useRouter();

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Simulate a user registration and login
        login('user');
        router.push('/account/dashboard');
    };


  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
        <div className="flex items-center justify-center py-12">
            <Card className="mx-auto grid w-[380px] gap-6 border-0 shadow-none sm:border-solid sm:shadow-sm">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
                    <CardDescription>
                        Enter your information to create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full-name">Full Name</Label>
                            <Input id="full-name" placeholder="John Doe" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="hidden bg-muted lg:block relative">
            <Image
                src="https://picsum.photos/1200/1800?random=2"
                alt="Image"
                width="1200"
                height="1800"
                className="h-full w-full object-cover dark:brightness-[0.3]"
                data-ai-hint="fashion lifestyle"
            />
            <div className="absolute top-0 left-0 h-full w-full flex items-end p-12">
                <div className="text-white">
                    <h2 className="text-4xl font-bold font-headline">Your Style, Your Way</h2>
                    <p className="text-lg mt-4">Join us to unlock personalized recommendations and a seamless shopping experience.</p>
                </div>
            </div>
        </div>
    </div>
  )
}
