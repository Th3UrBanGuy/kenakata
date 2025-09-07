
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
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Loader2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { useData } from '@/context/DataProvider';
import { useState } from 'react';

const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.coerce.number().min(0.01, 'Discount value is required'),
  isActive: z.boolean(),
  applicableProductIds: z.string().optional(),
  validUntil: z.date().optional(),
  maxClaims: z.coerce.number().optional(),
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponFormProps {
  coupon?: Coupon;
}

export function CouponForm({ coupon }: CouponFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { addCoupon, updateCoupon } = useData();
  const [isSaving, setIsSaving] = useState(false);
  
  const defaultValues = coupon
    ? { 
        ...coupon, 
        applicableProductIds: coupon.applicableProductIds?.join(', '),
        validUntil: coupon.validUntil ? new Date(coupon.validUntil) : undefined,
        maxClaims: coupon.maxClaims,
      }
    : {
        code: '',
        discountType: 'percentage' as const,
        discountValue: 10,
        isActive: true,
        applicableProductIds: '',
        validUntil: undefined,
        maxClaims: undefined,
      };

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues,
  });

  async function onSubmit(data: CouponFormValues) {
    setIsSaving(true);
    try {
        const finalData = {
            ...data,
            applicableProductIds: data.applicableProductIds?.split(',').map(s => s.trim()).filter(Boolean),
            validUntil: data.validUntil?.toISOString()
        }
        
        if (coupon) {
            await updateCoupon(coupon.id, finalData);
            toast({
                title: "Coupon Updated",
                description: `Coupon "${data.code}" has been successfully updated.`,
            });
        } else {
            await addCoupon(finalData);
            toast({
                title: "Coupon Created",
                description: `Coupon "${data.code}" has been successfully created.`,
            });
        }
        router.push('/admin/coupons');
    } catch (error: any) {
        toast({
            title: "Save Failed",
            description: error.message || "There was a problem saving the coupon.",
            variant: "destructive"
        });
    } finally {
        setIsSaving(false);
    }
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
                    disabled={isSaving}
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
                  <Input placeholder="SUMMER25" {...field} disabled={isSaving} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSaving}>
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
                    <Input type="number" step="0.01" placeholder={form.watch('discountType') === 'percentage' ? '10' : '10.00'} {...field} disabled={isSaving}/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
             <FormField
                control={form.control}
                name="validUntil"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Valid Until (Optional)</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            disabled={isSaving}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormDescription>
                        The last date this coupon is valid.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
             />
             <FormField
                control={form.control}
                name="maxClaims"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Max Claims (Optional)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="100" {...field} disabled={isSaving} />
                    </FormControl>
                    <FormDescription>
                        The maximum number of times this coupon can be used.
                    </FormDescription>
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
                  <Textarea placeholder="prod_1, prod_2, prod_5" {...field} disabled={isSaving}/>
                </FormControl>
                <FormDescription>
                    Enter a comma-separated list of product IDs. If left blank, the coupon will apply to all products.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        <Button type="submit" size="lg" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Pencil className="mr-2 h-4 w-4" />
          {coupon ? 'Save Changes' : 'Create Coupon'}
        </Button>
      </form>
    </Form>
  );
}
