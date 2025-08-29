import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';

export default function Home() {
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
              {categories.map((category) => (
                <Button key={category} variant="secondary" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section id="all-products" className="w-full py-12 md:py-24">
           <div className="container px-4 md:px-6">
             <h2 className="text-3xl font-bold tracking-tighter text-center mb-10 font-headline">
                All Products
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
