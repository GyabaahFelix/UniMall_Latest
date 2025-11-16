import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Daniel Godfred", rating: 5, comment: "UniMall helped me get a brand-new textbook for half the price." },
  { name: "Santan Dennis", rating: 5, comment: "The verified student system is brilliant. Safe buying and selling." },
  { name: "Eunice", rating: 5, comment: "Smooth experience from browsing to checkout." },
  { name: "Gryphosa", rating: 5, comment: "Sold my old calculator in less than an hour. Fast and safe!" },
  { name: "Isabel", rating: 5, comment: "Impressed with how organized everything is." },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-muted/10">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-12">What Students Say</h2>
        <Carousel plugins={[Autoplay({ delay: 2500 })]} className="w-full">
          <CarouselContent className="gap-4">
            {testimonials.map((t, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="h-full shadow-lg rounded-xl">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < t.rating ? "text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <p className="text-muted-foreground flex-1 mb-4">&ldquo;{t.comment}&rdquo;</p>
                    <p className="font-semibold text-lg">- {t.name}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
