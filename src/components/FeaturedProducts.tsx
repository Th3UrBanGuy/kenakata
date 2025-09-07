
'use client';

import { ProductCard } from '@/components/ProductCard';
import { useData } from '@/context/DataProvider';
import { Skeleton } from './ui/skeleton';

export function FeaturedProducts() {
  const { products, isLoading } = useData();
  // Simple logic to feature some products.
  const featuredProducts = products.slice(0, 4);

  return (
    <section id="products" className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
         <h2 className="text-3xl font-bold tracking-tighter text-center mb-10 font-headline">
            Featured Products
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          ) : (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}


function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[250px] w-full rounded-xl" />
      <div className="space-y-2 p-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
