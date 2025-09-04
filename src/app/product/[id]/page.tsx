
'use client';

import { useState, useMemo, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartProvider';
import { useWishlist } from '@/context/WishlistProvider';
import { cn } from '@/lib/utils';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthProvider';
import { useData } from '@/context/DataProvider';

export default function ProductPage() {
  const params = useParams();
  const { id } = params;
  const { products } = useData();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { role } = useAuth();
  const product = products.find((p) => p.id === id);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const availableColors = useMemo(() => {
    if (!product) return [];
    return [...new Set(product.variants.map((v) => v.color))];
  }, [product]);

  const availableSizes = useMemo(() => {
    if (!product || !selectedColor) return [];
    return [
      ...new Set(
        product.variants
          .filter((v) => v.color === selectedColor)
          .map((v) => v.size)
      ),
    ];
  }, [product, selectedColor]);
  
  // Set initial selections
  useEffect(() => {
    if (product && !selectedColor && availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    }
  }, [product, selectedColor, availableColors]);

  useEffect(() => {
      if (product && selectedColor && !selectedSize && availableSizes.length > 0) {
        const firstAvailableSize = availableSizes.find(size => {
            const variant = product.variants.find(v => v.color === selectedColor && v.size === size);
            return variant && variant.stock > 0;
        }) || availableSizes[0];
        setSelectedSize(firstAvailableSize);
      }
  }, [product, selectedColor, selectedSize, availableSizes]);

  const selectedVariant = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return null;
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [product, selectedColor, selectedSize]);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    if (selectedVariant && product) {
      addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        color: selectedVariant.color,
        size: selectedVariant.size,
        price: selectedVariant.price,
        imageUrl: selectedVariant.imageUrl,
      });
    }
  };
  
  const isWishlisted = selectedVariant ? wishlist.some(item => item.variantId === selectedVariant.id) : false;

  const handleWishlistToggle = () => {
    if (selectedVariant && product) {
      if (isWishlisted) {
        removeFromWishlist(selectedVariant.id);
      } else {
        addToWishlist({
          productId: product.id,
          variantId: selectedVariant.id,
          name: product.name,
          color: selectedVariant.color,
          size: selectedVariant.size,
          price: selectedVariant.price,
          imageUrl: selectedVariant.imageUrl,
        });
      }
    }
  };

  const imageUrl = selectedVariant?.imageUrl || product.variants[0].imageUrl;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden border shadow-lg">
                <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-opacity duration-300"
                data-ai-hint="product photo"
                />
            </div>
            {/* Thumbnails can be added here */}
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold font-headline">{product.name}</h1>
            <p className="text-muted-foreground text-lg">{product.description}</p>
            <p className="text-3xl font-bold text-primary">
              ${selectedVariant ? selectedVariant.price.toFixed(2) : product.variants[0].price.toFixed(2)}
            </p>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Color</h3>
              <div className="flex gap-3">
                {availableColors.map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    className={cn(
                      'capitalize p-4 border-2',
                      selectedColor === color ? 'border-primary' : 'border-border'
                    )}
                    onClick={() => { setSelectedColor(color); setSelectedSize(null); }}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {selectedColor && availableSizes.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Size</h3>
                <RadioGroup value={selectedSize || ''} onValueChange={setSelectedSize}>
                  <div className="flex gap-3 flex-wrap">
                    {availableSizes.map((size) => {
                      const variantForSize = product.variants.find(v => v.color === selectedColor && v.size === size);
                      const isAvailable = variantForSize && variantForSize.stock > 0;
                      return (
                        <div key={size}>
                          <RadioGroupItem value={size} id={size} className="sr-only" disabled={!isAvailable} />
                          <Label
                            htmlFor={size}
                            className={cn(
                              "flex items-center justify-center rounded-md border-2 px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                              selectedSize === size && 'border-primary',
                              !isAvailable ? 'cursor-not-allowed opacity-50 bg-muted/50' : 'cursor-pointer'
                            )}
                          >
                            {size}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </RadioGroup>
              </div>
            )}
            
            {role !== 'admin' && (
              <div className="flex gap-4">
                  <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={!selectedVariant || selectedVariant.stock === 0}>
                      {selectedVariant?.stock === 0 ? 'Out of Stock' : (
                          <>
                              <ShoppingBag className="mr-2 h-5 w-5" />
                              Add to Bag
                          </>
                      )}
                  </Button>
                  <Button size="lg" variant="outline" className="px-4" onClick={handleWishlistToggle} disabled={!selectedVariant}>
                      <Heart className={cn("h-5 w-5", isWishlisted && "text-red-500 fill-current")} />
                  </Button>
              </div>
            )}

            {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 10 && (
                <p className="text-yellow-500 text-sm text-center">
                    Hurry! Only {selectedVariant.stock} left in stock.
                </p>
            )}
             {selectedVariant && selectedVariant.stock === 0 && (
                 <p className="text-red-500 text-sm text-center">
                    This variant is out of stock.
                </p>
            )}
          </div>
        </div>

        <div className="mt-16">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    {product.comments.length > 0 ? (
                        <div className="space-y-6">
                            {product.comments.map((comment, index) => (
                                <div key={comment.id}>
                                    <div className="flex gap-4">
                                        <Avatar>
                                            <AvatarFallback>{comment.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold">{comment.author}</p>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={cn("h-4 w-4", i < comment.rating ? "text-primary fill-primary" : "text-muted-foreground")}/>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">{isClient ? new Date(comment.date).toLocaleDateString() : ''}</p>
                                            <p>{comment.text}</p>
                                        </div>
                                    </div>
                                    {index < product.comments.length - 1 && <Separator className="mt-6" />}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No reviews yet for this product.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
