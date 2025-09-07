
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthProvider";
import { useData } from "@/context/DataProvider";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type ProfileFormValues = {
    name: string;
    phone: string;
};

export default function ProfilePage() {
    const { user } = useAuth();
    const { updateAppUser } = useData();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { isDirty } } = useForm<ProfileFormValues>({
        defaultValues: {
            name: '',
            phone: ''
        }
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.displayName || '',
                phone: user.phoneNumber || ''
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: ProfileFormValues) => {
        if (!user) return;
        setIsLoading(true);
        try {
            await updateAppUser(user.uid, { name: data.name, phone: data.phone });
            toast({
                title: "Profile Updated",
                description: "Your personal information has been saved.",
            });
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">My Profile</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" {...register('name')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue={user?.email || ''} readOnly disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" {...register('phone')} />
                    </div>
                    <Button type="submit" disabled={isLoading || !isDirty}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
