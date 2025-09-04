import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { announcements } from '@/lib/data';
import type { Announcement } from '@/lib/types';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

export function Hero() {
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
                {announcements.map((announcement: Announcement, index) => (
                    <CarouselItem key={announcement.id}>
                        <div className="p-1">
                           <Link href={announcement.link}>
                            <Card className="overflow-hidden border-0">
                                <CardContent className="p-0">
                                    <div className="relative aspect-video">
                                        <Image
                                            src={announcement.imageUrl}
                                            alt={announcement.title}
                                            fill
                                            className="object-cover rounded-lg"
                                            data-ai-hint="promotional photo"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
                                        <div className={cn(
                                            "absolute bottom-0 p-8 md:p-12 text-white space-y-4",
                                            index % 2 === 0 ? "left-0 text-left" : "right-0 text-right"
                                            )}>
                                            
                                            <Badge variant="secondary" className="text-sm">{announcement.tag}</Badge>
                                            
                                            <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter font-headline drop-shadow-md">{announcement.title}</h1>
                                            <p className="text-lg text-white/80 max-w-lg hidden md:block">{announcement.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                             </Link>
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
