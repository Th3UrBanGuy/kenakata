
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
    const { user, sendPasswordReset, deleteCurrentUser } = useAuth();
    const { toast } = useToast();
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const handlePasswordReset = async () => {
        setIsPasswordLoading(true);
        try {
            await sendPasswordReset();
            toast({
                title: "Password Reset Email Sent",
                description: "Check your inbox for a link to reset your password.",
            });
        } catch (error: any) {
             toast({
                title: "Failed to Send Email",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleteLoading(true);
        try {
            await deleteCurrentUser();
            toast({
                title: "Account Deleted",
                description: "Your account has been permanently deleted.",
            });
            // The user will be redirected automatically by the AuthProvider
        } catch (error: any) {
            toast({
                title: "Deletion Failed",
                description: error.message,
                variant: "destructive",
            });
            setIsDeleteLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Account Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-4">
                     <h3 className="font-semibold">Change Password</h3>
                     <p className="text-sm text-muted-foreground">Click the button below to receive an email with a link to reset your password.</p>
                    <Button onClick={handlePasswordReset} disabled={isPasswordLoading || !user}>
                        {isPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Password Reset Email
                    </Button>
                </div>
                <Separator />
                <div className="space-y-4">
                     <h3 className="font-semibold text-destructive">Delete Account</h3>
                     <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleteLoading || !user}>
                                Delete My Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" disabled={isDeleteLoading}>
                                     {isDeleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Yes, delete my account
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    );
}
