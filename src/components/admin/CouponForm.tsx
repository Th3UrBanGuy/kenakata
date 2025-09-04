
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Coupon } from '@/lib/types';
import { Textarea } from '../ui/textarea';

const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.coerce.number().min(0.01, 'Discount value is required'),
  isActive: z.boolean(),
  applicableProductIds: z.string().optional(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponFormProps {
  coupon?: Coupon;
}

export function CouponForm({ coupon }: CouponFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const defaultValues = coupon
    ? { ...coupon, applicableProductIds: coupon.applicableProductIds?.join(', ') }
    : {
        code: '',
        discountType: 'percentage' as const,
        discountValue: 10,
        isActive: true,
        applicableProductIds: '',
      };

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues,
  });

  function onSubmit(data: CouponFormValues) {
    console.log({
        ...data,
        applicableProductIds: data.applicableProductIds?.split(',').map(s => s.trim()).filter(Boolean)
    });
    toast({
      title: `Coupon ${coupon ? 'Updated' : 'Created'}`,
      description: `Coupon "${data.code}" has been successfully saved.`,
    });
    router.push('/admin/coupons');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <FormLabel>Activate Coupon</FormLabel>
                    <FormDescription>Make this coupon available for use.</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input placeholder="SUMMER25" {...field} />
                </FormControl>
                <FormDescription>The code customers will enter at checkout.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="grid md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a discount type" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="discountValue"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Discount Value</FormLabel>
                <FormControl>
                    <Input type="number" step="0.01" placeholder={form.watch('discountType') === 'percentage' ? '10' : '10.00'} {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
         <FormField
            control={form.control}
            name="applicableProductIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Applicable Products (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="prod_1, prod_2, prod_5" {...field} />
                </FormControl>
                <FormDescription>
                    Enter a comma-separated list of product IDs. If left blank, the coupon will apply to all products.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        <Button type="submit" size="lg">
          {coupon ? 'Save Changes' : 'Create Coupon'}
        </Button>
      </form>
    </Form>
  );
}
