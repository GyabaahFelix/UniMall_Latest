import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import laptopSlide from "@/assets/laptop-slide.png";
import fashionSlide from "@/assets/fashion-slide.jpg";
import booksSlide from "@/assets/books-slide.jpg";
import foodSlide from "@/assets/food-slide.jpg";

const slideMessages = [
  { title: "Best Laptops on Campus", image: laptopSlide },
  { title: "Fashion Deals", image: fashionSlide },
  { title: "Books & Stationery", image: booksSlide },
  { title: "Food & Snacks", image: foodSlide },
];

export default function SlideShow() {
  return (
    <section className="w-full bg-muted/10 py-8 md:py-12">
      <div className="w-full relative overflow-hidden">
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="w-full h-[400px] md:h-[600px]"
        >
          <CarouselContent>
            {slideMessages.map((slide, index) => (
              <CarouselItem key={index}>
                <Card className="relative w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="object-cover w-full h-full"
                  />
                  <CardContent className="absolute bottom-8 left-8 text-white bg-black/50 p-6 rounded-lg max-w-lg">
                    <h2 className="text-3xl md:text-5xl font-bold">{slide.title}</h2>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Previous Button */}
          <CarouselPrevious className="hidden md:flex absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 cursor-pointer z-20">
            &#8592;
          </CarouselPrevious>

          {/* Next Button */}
          <CarouselNext className="hidden md:flex absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 cursor-pointer z-20">
            &#8594;
          </CarouselNext>
        </Carousel>
      </div>
    </section>
  );
}
