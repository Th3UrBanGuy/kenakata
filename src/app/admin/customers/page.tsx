
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/context/DataProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import type { AppUser } from "@/lib/types";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersPage() {
    const { users, isLoading, setUserRole, deleteUser } = useData();
    const { toast } = useToast();
    const { user: currentUser } = useAuth();

    const handleDelete = async (user: AppUser) => {
        if (currentUser?.uid === user.uid) {
            toast({ title: "Action Forbidden", description: "You cannot delete your own account.", variant: 'destructive' });
            return;
        }
        try {
            await deleteUser(user.uid);
            toast({ title: "User Deleted", description: `${user.email} has been deleted.` });
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to delete user: ${error.message}`, variant: 'destructive' });
        }
    };

    const handleRoleChange = async (user: AppUser) => {
        if (currentUser?.uid === user.uid) {
            toast({ title: "Action Forbidden", description: "You cannot change your own role.", variant: 'destructive' });
            return;
        }
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        try {
            await setUserRole(user.uid, newRole);
            toast({ title: "Role Updated", description: `${user.email} is now a(n) ${newRole}.` });
        } catch (error: any) {
            toast({ title: "Error", description: `Failed to update role: ${error.message}`, variant: 'destructive' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl font-headline">Customers</h1>
                    <p className="text-muted-foreground text-sm">View and manage all registered users.</p>
                </div>
            </div>
             <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden sm:table-cell">Email</TableHead>
                                <TableHead className="hidden md:table-cell">Role</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && users.length === 0 ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                            ) : (
                                users.map((user: AppUser) => (
                                    <TableRow key={user.uid}>
                                        <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">{user.role}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <Link href={`/admin/customers/${encodeURIComponent(user.uid)}`}>
                                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem onSelect={() => handleRoleChange(user)}>
                                                        {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onSelect={(e) => e.preventDefault()}
                                                                disabled={currentUser?.uid === user.uid}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete User
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action will permanently delete the user "{user.email}". This cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(user)}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
        </div>
    )
}
