import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

export default function Home() {
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-headline">
                  KenaKata Online Store
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Discover our latest collection of high-quality products.
                </p>
              </div>
            </div>
          </div>
        </section>

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

        <section id="products" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
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
