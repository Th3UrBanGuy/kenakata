
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Trash2, LineChart } from 'lucide-react';
import { coupons } from '@/lib/data';
import type { Coupon } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export default function CouponsPage() {
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Coupons</h1>
          <p className="text-muted-foreground">Manage promotional codes for your store.</p>
        </div>
        <Link href="/admin/coupons/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Coupon
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>A list of all promotional coupons in your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
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
                    <TableCell>{formatDiscount(coupon.discountType, coupon.discountValue)}</TableCell>
                    <TableCell>
                        <Badge variant={status.variant}>
                            {status.text}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        {coupon.maxClaims ? (
                            <div className="flex items-center gap-2">
                               <Progress value={usagePercentage} className="w-24" />
                               <span className="text-muted-foreground text-xs">{coupon.claims || 0}/{coupon.maxClaims}</span>
                            </div>
                        ) : (
                            <span className="text-muted-foreground">{coupon.claims || 0} used</span>
                        )}
                    </TableCell>
                    <TableCell>
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
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>{coupon.isActive ? 'Deactivate' : 'Activate'}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
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
