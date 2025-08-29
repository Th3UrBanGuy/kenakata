import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { products } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Badge } from './ui/badge';

export function Hero() {
  const promotionalProducts = products.filter(p => p.promotion);

  return (
    <section className="w-full bg-background">
        <div className="container px-4 md:px-6 py-12">
            <Carousel
                opts={{
                align: "start",
                loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                {promotionalProducts.map((product: Product) => (
                    <CarouselItem key={product.id}>
                        <div className="p-1">
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="grid md:grid-cols-2">
                                        <div className="relative aspect-[4/3] md:aspect-auto">
                                            <Image
                                                src={product.variants[0].imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                data-ai-hint="product photo"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center p-8 space-y-4">
                                            {product.promotion && (
                                                <Badge variant="secondary" className="text-sm self-start">{product.promotion}</Badge>
                                            )}
                                            <h1 className="text-4xl font-bold tracking-tighter font-headline">{product.name}</h1>
                                            <p className="text-lg text-muted-foreground">{product.description}</p>
                                            <div className="flex items-baseline space-x-2">
                                                <span className="text-3xl font-bold text-primary">${product.variants[0].price.toFixed(2)}</span>
                                            </div>
                                            <Link href={`/product/${product.id}`}>
                                                <Button size="lg">Shop Now</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
        </div>
    </section>
  );
}
