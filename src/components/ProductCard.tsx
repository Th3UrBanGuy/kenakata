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
    <Link href={`/product/${product.id}`}>
        <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
          <CardHeader className="p-0">
            <div className="relative aspect-square w-full">
              <Image
                src={defaultVariant.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="product photo"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg font-headline">{product.name}</CardTitle>
          </CardContent>
          <CardFooter className="p-4 flex justify-between items-center">
            <p className="text-xl font-bold text-primary">${defaultVariant.price.toFixed(2)}</p>
            <Button variant="ghost" size="sm">
                View
                <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
          </CardFooter>
        </Card>
    </Link>
  );
}
