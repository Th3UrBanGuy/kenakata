'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AlertTriangle, Circle, Loader2, PackagePlus, Sparkles, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { products as allProducts } from '@/lib/data';
import { getInventoryAnalysis } from '@/lib/actions';
import type { AnalyzeInventoryLevelsOutput } from '@/ai/flows/inventory-shortage-alerts';

type AnalysisResult = AnalyzeInventoryLevelsOutput | { error: string };

export default function AdminDashboard() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    const result = await getInventoryAnalysis();
    setAnalysis(result);
    setIsLoading(false);
  };

  const { lowStockMap, outOfStockMap } = useMemo(() => {
    if (!analysis || 'error' in analysis) return { lowStockMap: new Map(), outOfStockMap: new Map() };
    const lowStockMap = new Map(analysis.lowStockProducts.map(p => [p.productId, p]));
    const outOfStockMap = new Map(analysis.outOfStockProducts.map(p => [p.productId, p]));
    return { lowStockMap, outOfStockMap };
  }, [analysis]);

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Products</h1>
          <p className="text-muted-foreground">Manage your products and view their inventory status.</p>
        </div>
        <div className="flex items-center gap-4">
           <Button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Analyze Inventory
          </Button>
          <Link href="/admin/products/new">
            <Button>
              <PackagePlus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Product Variants</CardTitle>
          <CardDescription>A list of all product variants in your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allProducts.flatMap((product) =>
                product.variants.map((variant) => {
                  const variantId = `${product.id}-${variant.id}`;
                  const lowStockInfo = lowStockMap.get(variantId);
                  const outOfStockInfo = outOfStockMap.get(variantId);

                  let statusIcon = <Circle className="h-3 w-3 text-green-500 fill-green-500" />;
                  let alertMessage = 'This variant is in stock.';
                  let status = 'In Stock';

                  if (outOfStockInfo) {
                    status = 'Out of Stock';
                    statusIcon = <XCircle className="h-4 w-4 text-red-500" />;
                    alertMessage = outOfStockInfo.alertMessage;
                  } else if (lowStockInfo) {
                    status = 'Low Stock';
                    statusIcon = <AlertTriangle className="h-4 w-4 text-yellow-500" />;
                    alertMessage = lowStockInfo.alertMessage;
                  }

                  return (
                    <TableRow key={variantId}>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>{statusIcon}</TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">{status}</p>
                            <p>{alertMessage}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{variant.color}</Badge>
                        <Badge variant="outline" className="ml-2 capitalize">{variant.size}</Badge>
                      </TableCell>
                      <TableCell>${variant.price.toFixed(2)}</TableCell>
                      <TableCell>{variant.stock}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
