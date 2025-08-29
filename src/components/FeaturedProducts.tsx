import { products } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';

export function FeaturedProducts() {
  // Simple logic to feature some products.
  const featuredProducts = products.slice(0, 4);

  return (
    <section id="products" className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
         <h2 className="text-3xl font-bold tracking-tighter text-center mb-10 font-headline">
            Featured Products
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
