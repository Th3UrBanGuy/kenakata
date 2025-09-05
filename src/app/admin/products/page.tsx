
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/context/DataProvider';
import Image from 'next/image';
import { MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function AdminProductsPage() {
  const { products, deleteProduct } = useData();
  const { toast } = useToast();

  const handleDelete = async (product: Product) => {
    try {
      await deleteProduct(product.id);
      toast({
        title: "Product Deleted",
        description: `"${product.name}" has been successfully deleted.`,
      });
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      toast({
        title: "Delete Failed",
        description: error.message || "There was a problem deleting the product.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl font-headline">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your products and view their inventory status.</p>
        </div>
        <Link href="/admin/products/new">
            <Button>
                <PlusCircle className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Add Product</span>
            </Button>
        </Link>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[80px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Variants</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell p-2">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={product.variants[0]?.imageUrl || '/placeholder.svg'}
                      width="64"
                      data-ai-hint="product photo"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{product.variants.length}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </Link>
                        <Link href={`/product/${product.id}`} target="_blank">
                          <DropdownMenuItem>View on Store</DropdownMenuItem>
                        </Link>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <DropdownMenuItem
                                  className="text-destructive"
                                  onSelect={(e) => e.preventDefault()} // Prevents dropdown from closing
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the product "{product.name}".
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(product)}>
                                    Delete
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
