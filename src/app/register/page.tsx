
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
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
    const { register } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(email, password, fullName);
            toast({ title: "Registration Successful", description: "A verification email has been sent." });
            router.push('/verify-email');
        } catch (error: any) {
            console.error("Registration failed:", error);
            toast({ title: "Registration Failed", description: error.message, variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
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
                            <Input id="full-name" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </div>
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
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
