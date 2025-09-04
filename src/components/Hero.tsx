import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { products } from '@/lib/data';
import type { Product } from '@/lib/types';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

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
                {promotionalProducts.map((product: Product, index) => (
                    <CarouselItem key={product.id}>
                        <div className="p-1">
                            <Card className="overflow-hidden border-0">
                                <CardContent className="p-0">
                                    <div className="relative aspect-video">
                                        <Image
                                            src={product.variants[0].imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover rounded-lg"
                                            data-ai-hint="product photo"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
                                        <div className={cn(
                                            "absolute bottom-0 p-8 md:p-12 text-white space-y-4",
                                            index % 2 === 0 ? "left-0 text-left" : "right-0 text-right"
                                            )}>
                                            {product.promotion && (
                                                <Badge variant="secondary" className="text-sm">{product.promotion}</Badge>
                                            )}
                                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter font-headline drop-shadow-md">{product.name}</h1>
                                            <p className="text-lg text-white/80 max-w-lg hidden md:block">{product.description}</p>
                                            <div className="flex items-baseline space-x-2" style={{justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end'}}>
                                                <span className="text-3xl font-bold">${product.variants[0].price.toFixed(2)}</span>
                                            </div>
                                            <Link href={`/product/${product.id}`}>
                                                <Button size="lg" variant="secondary">Shop Now</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 hidden md:flex" />
                <CarouselNext className="right-4 hidden md:flex" />
            </Carousel>
        </div>
    </section>
  );
}
