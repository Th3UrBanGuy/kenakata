
'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { useData } from '@/context/DataProvider';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { products, isLoading } = useData();
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />

        <section id="categories" className="w-full py-12 md:py-24 bg-card">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-8 font-headline">
              Shop by Category
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-32 rounded-md" />
                ))
              ) : (
                categories.map((category) => (
                  <Button key={category} variant="secondary" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    {category}
                  </Button>
                ))
              )}
            </div>
          </div>
        </section>

        <section id="all-products" className="w-full py-12 md:py-24">
           <div className="container px-4 md:px-6">
             <h2 className="text-3xl font-bold tracking-tighter text-center mb-10 font-headline">
                All Products
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))
              ) : (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
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
