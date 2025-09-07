
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { Coupon, Product } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Loader2, Pencil, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { useData } from '@/context/DataProvider';
import { useState, useMemo } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';


const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.coerce.number().min(0.01, 'Discount value is required'),
  isActive: z.boolean(),
  applicableProductIds: z.array(z.string()).optional(),
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
  const { products, addCoupon, updateCoupon } = useData();
  const [isSaving, setIsSaving] = useState(false);

  // UI state
  const [validityType, setValidityType] = useState(coupon?.validUntil ? 'custom' : 'forever');
  const [claimsType, setClaimsType] = useState(coupon?.maxClaims ? 'custom' : 'unlimited');
  const [productsType, setProductsType] = useState(coupon?.applicableProductIds && coupon.applicableProductIds.length > 0 ? 'specific' : 'all');
  const [productSearchTerm, setProductSearchTerm] = useState('');

  const defaultValues: CouponFormValues = {
    code: coupon?.code || '',
    discountType: coupon?.discountType || 'percentage',
    discountValue: coupon?.discountValue || 10,
    isActive: coupon?.isActive ?? true,
    applicableProductIds: coupon?.applicableProductIds || [],
    validUntil: coupon?.validUntil ? new Date(coupon.validUntil) : undefined,
    maxClaims: coupon?.maxClaims,
  };

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues,
  });

  const filteredProducts = useMemo(() => {
    if (!productSearchTerm) return products;
    return products.filter(p => p.name.toLowerCase().includes(productSearchTerm.toLowerCase()));
  }, [products, productSearchTerm]);

  async function onSubmit(data: CouponFormValues) {
    setIsSaving(true);
    
    const couponPayload: Omit<Coupon, 'id' | 'claims'> = {
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        isActive: data.isActive,
        applicableProductIds: productsType === 'specific' ? data.applicableProductIds : [],
    };
    
    if (validityType === 'custom' && data.validUntil) {
        couponPayload.validUntil = data.validUntil.toISOString();
    }

    if (claimsType === 'custom' && data.maxClaims) {
        couponPayload.maxClaims = data.maxClaims;
    }

    try {
        if (coupon) {
            await updateCoupon(coupon.id, couponPayload);
            toast({
                title: "Coupon Updated",
                description: `Coupon "${data.code}" has been successfully updated.`,
            });
        } else {
            await addCoupon(couponPayload);
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

  const selectedProducts = products.filter(p => form.watch('applicableProductIds')?.includes(p.id));

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
                  <Input placeholder="SUMMER25" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} disabled={isSaving} />
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

        {/* Product Applicability */}
        <FormField
            name="applicableProductIds"
            control={form.control}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Product Applicability</FormLabel>
                    <RadioGroup
                        onValueChange={(value) => {
                            setProductsType(value);
                            if (value === 'all') field.onChange([]);
                        }}
                        defaultValue={productsType}
                        className="flex gap-4"
                        >
                        <FormItem className="flex items-center space-x-2">
                            <FormControl><RadioGroupItem value="all" id="all-products" /></FormControl>
                            <Label htmlFor="all-products">All Products</Label>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                            <FormControl><RadioGroupItem value="specific" id="specific-products" /></FormControl>
                            <Label htmlFor="specific-products">Specific Products</Label>
                        </FormItem>
                    </RadioGroup>
                    
                    {productsType === 'specific' && (
                        <div className="pt-2">
                           <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Select Products</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Select Applicable Products</DialogTitle>
                                    </DialogHeader>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search products..."
                                            className="pl-10"
                                            value={productSearchTerm}
                                            onChange={(e) => setProductSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <ScrollArea className="h-[300px] border rounded-md p-4">
                                        <div className="space-y-4">
                                            {filteredProducts.map((product) => (
                                                 <div key={product.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={product.id}
                                                        checked={field.value?.includes(product.id)}
                                                        onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...(field.value || []), product.id])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                    (value) => value !== product.id
                                                                )
                                                            )
                                                        }}
                                                    />
                                                    <label htmlFor={product.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        {product.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </DialogContent>
                           </Dialog>
                           <div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-1">
                                {selectedProducts.length > 0 ? (
                                    selectedProducts.map(p => <Badge key={p.id} variant="secondary">{p.name}</Badge>)
                                ) : (
                                    <span>No products selected. Coupon will not apply.</span>
                                )}
                           </div>
                        </div>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
        
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
                name="validUntil"
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Validity</FormLabel>
                        <RadioGroup
                            onValueChange={setValidityType}
                            defaultValue={validityType}
                            className="flex gap-4"
                            >
                            <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="forever" id="forever" /></FormControl>
                                <Label htmlFor="forever">Forever</Label>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="custom" id="custom-date" /></FormControl>
                                <Label htmlFor="custom-date">Set Expiration</Label>
                            </FormItem>
                        </RadioGroup>
                        {validityType === 'custom' && (
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
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                        )}
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name="maxClaims"
                control={form.control}
                render={({ field }) => (
                     <FormItem>
                        <FormLabel>Usage Limits</FormLabel>
                        <RadioGroup
                            onValueChange={setClaimsType}
                            defaultValue={claimsType}
                            className="flex gap-4"
                            >
                            <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="unlimited" id="unlimited" /></FormControl>
                                <Label htmlFor="unlimited">Unlimited</Label>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                                <FormControl><RadioGroupItem value="custom" id="custom-claims" /></FormControl>
                                <Label htmlFor="custom-claims">Set Max Claims</Label>
                            </FormItem>
                        </RadioGroup>
                        {claimsType === 'custom' && (
                            <FormControl>
                                <Input type="number" placeholder="100" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} disabled={isSaving} />
                            </FormControl>
                        )}
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <Button type="submit" size="lg" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Pencil className="mr-2 h-4 w-4" />
          {coupon ? 'Save Changes' : 'Create Coupon'}
        </Button>
      </form>
    </Form>
  );
}
