
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { Button } from './ui/button';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartProvider';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const defaultVariant = product.variants[0];

  const handleAddToCart = () => {
    if (defaultVariant && product) {
      addToCart({
        productId: product.id,
        variantId: defaultVariant.id,
        name: product.name,
        color: defaultVariant.color,
        size: defaultVariant.size,
        price: defaultVariant.price,
        imageUrl: defaultVariant.imageUrl,
      });
    }
  };


  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 group">
      <Link href={`/product/${product.id}`} className="block flex-grow">
        <CardHeader className="p-0">
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={defaultVariant.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              data-ai-hint="product photo"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors flex-1">{product.name}</CardTitle>
            <p className="text-lg font-bold text-primary">${defaultVariant.price.toFixed(2)}</p>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={handleAddToCart} disabled={defaultVariant.stock === 0} className="w-full">
            <ShoppingBag className="mr-2 h-4 w-4"/>
            Add to Bag
        </Button>
        <Link href={`/product/${product.id}`} className="w-full">
          <Button variant="default" className="w-full">
              View
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"/>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
