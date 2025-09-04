
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Heart, Trash2 } from 'lucide-react';
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


export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">My Wishlist</CardTitle>
                <CardDescription>Your collection of favorite items.</CardDescription>
            </CardHeader>
            <CardContent>
                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map(item => (
                            <Card key={item.variantId} className="group relative overflow-hidden">
                                <Link href={`/product/${item.productId}`}>
                                    <div className="relative aspect-square w-full">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            data-ai-hint="product photo"
                                        />
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground capitalize">{item.color} / {item.size}</p>
                                    <p className="font-bold text-primary mt-2">${item.price.toFixed(2)}</p>
                                </div>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/70">
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action will remove "{item.name}" from your wishlist.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => removeFromWishlist(item.variantId)}>
                                        Remove
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-16">
                        <Heart className="h-20 w-20 text-muted-foreground/50 mb-4" />
                        <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
                        <p className="text-muted-foreground mt-2">
                            Add items you love to your wishlist to keep track of them.
                        </p>
                        <Link href="/">
                            <Button className="mt-6">Discover Products</Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
