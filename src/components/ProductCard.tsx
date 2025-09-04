import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const defaultVariant = product.variants[0];

  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 group">
      <Link href={`/product/${product.id}`} className="block">
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
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-headline group-hover:text-primary transition-colors">{product.name}</CardTitle>
        </CardContent>
      </Link>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="text-xl font-bold text-primary">${defaultVariant.price.toFixed(2)}</p>
        <Link href={`/product/${product.id}`}>
          <Button variant="ghost" size="sm" className="opacity-80 group-hover:opacity-100 transition-opacity">
              View
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"/>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
