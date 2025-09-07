
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash2, LineChart, Pencil } from 'lucide-react';
import type { Coupon } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { useData } from '@/context/DataProvider';
import { useToast } from '@/hooks/use-toast';
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

export default function CouponsPage() {
  const { coupons, deleteCoupon, toggleCouponStatus } = useData();
  const { toast } = useToast();

  const handleDelete = async (coupon: Coupon) => {
    try {
      await deleteCoupon(coupon.id);
      toast({
        title: "Coupon Deleted",
        description: `Coupon "${coupon.code}" has been successfully deleted.`,
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "There was a problem deleting the coupon.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (coupon: Coupon) => {
     try {
      await toggleCouponStatus(coupon.id, !coupon.isActive);
      toast({
        title: `Coupon ${!coupon.isActive ? 'Activated' : 'Deactivated'}`,
        description: `Coupon "${coupon.code}" has been updated.`,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "There was a problem updating the coupon status.",
        variant: "destructive",
      });
    }
  };


  const formatDiscount = (type: Coupon['discountType'], value: number) => {
    if (type === 'percentage') {
      return `${value}%`;
    }
    return `$${value.toFixed(2)}`;
  };
  
  const getStatus = (coupon: Coupon) => {
    if (!coupon.isActive) return { text: 'Inactive', variant: 'secondary' as const };
    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) return { text: 'Expired', variant: 'destructive' as const };
    if (coupon.maxClaims && (coupon.claims || 0) >= coupon.maxClaims) return { text: 'Fully Claimed', variant: 'destructive' as const };
    return { text: 'Active', variant: 'default' as const };
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Coupons</h1>
          <p className="text-sm text-muted-foreground">Manage promotional codes for your store.</p>
        </div>
        <Link href="/admin/coupons/new">
          <Button>
            <PlusCircle className="mr-0 md:mr-2 h-4 w-4" />
            <span className="hidden md:inline">Add Coupon</span>
          </Button>
        </Link>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead className="hidden sm:table-cell">Discount</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Usage</TableHead>
                <TableHead className="hidden sm:table-cell">Expires</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => {
                const status = getStatus(coupon);
                const usagePercentage = coupon.maxClaims ? ((coupon.claims || 0) / coupon.maxClaims) * 100 : 0;
                
                return (
                    <TableRow key={coupon.id}>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell className="hidden sm:table-cell">{formatDiscount(coupon.discountType, coupon.discountValue)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                        <Badge variant={status.variant}>
                            {status.text}
                        </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                        {coupon.maxClaims ? (
                            <div className="flex items-center gap-2">
                               <Progress value={usagePercentage} className="w-24" />
                               <span className="text-muted-foreground text-xs">{coupon.claims || 0}/{coupon.maxClaims}</span>
                            </div>
                        ) : (
                            <span className="text-muted-foreground">{coupon.claims || 0} used</span>
                        )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                        {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                             <Link href={`/admin/coupons/${coupon.id}/analytics`}>
                                <DropdownMenuItem>
                                    <LineChart className="mr-2 h-4 w-4" />
                                    Analytics
                                </DropdownMenuItem>
                            </Link>
                            <Link href={`/admin/coupons/${coupon.id}/edit`}>
                                <DropdownMenuItem>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem onSelect={() => handleToggleStatus(coupon)}>{coupon.isActive ? 'Deactivate' : 'Activate'}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action will permanently delete the coupon "{coupon.code}".
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(coupon)}>Delete</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
