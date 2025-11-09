import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import heroImage from "@/assets/hero-banner.jpg";
import saleBanner from "@/assets/sale-banner.jpg";

const slideMessages = [
  "Buy & Sell with Ease",
  "Verified Students Only",
  "Affordable Prices",
  "Fast Campus Delivery",
];

const categories = [
  { name: "Electronics", icon: "💻" },
  { name: "Fashion", icon: "👗" },
  { name: "Books", icon: "📚" },
  { name: "Food", icon: "🍕" },
  { name: "Hostel Essentials", icon: "🛏️" },
  { name: "Accessories", icon: "⌚" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "UniMall made it so easy to find affordable textbooks! Saved me so much money this semester.",
  },
  {
    name: "Michael Chen",
    rating: 5,
    comment: "Love the verified student system. Feel safe buying and selling on campus!",
  },
  {
    name: "Aisha Mohammed",
    rating: 5,
    comment: "Fast delivery and great prices. My go-to marketplace for everything I need!",
  },
];

export default function Index() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    fetchProducts();

    return () => subscription.unsubscribe();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, profiles(name)")
      .order("created_at", { ascending: false })
      .limit(8);

    if (data) {
      setProducts(data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-r from-primary/10 to-secondary/10 section-padding"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your trusted campus marketplace
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              for affordable, everyday essentials
            </p>
            <Link to="/products">
              <Button size="lg" className="text-lg px-8 py-6 btn-gradient-primary">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Slideshow Section */}
      <section className="section-padding bg-muted/20">
        <div className="container-custom">
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {slideMessages.map((message, index) => (
                <CarouselItem key={index}>
                  <Card className="border-2 border-primary/20">
                    <CardContent className="flex aspect-[3/1] items-center justify-center p-6">
                      <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {message}
                      </h2>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Sales Banner */}
      <section className="py-8">
        <div className="container-custom px-4">
          <Link to="/products">
            <div
              className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              style={{
                backgroundImage: `url(${saleBanner})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground drop-shadow-lg">
                  Sales Are On! 🎉
                </h2>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* New Products Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">New Products</h2>
            <Link to="/products">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.images?.[0] || "/placeholder.svg"}
                seller={product.profiles?.name}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="section-padding bg-muted/20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.name} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner #2 */}
      <section className="section-padding">
        <div className="container-custom">
          <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-2 border-accent/30">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-4">Back to School Deals</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Get everything you need for the semester at unbeatable prices
              </p>
              <Link to="/products">
                <Button size="lg" className="btn-gradient-secondary">
                  Explore Deals
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="section-padding bg-muted/20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">What Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">&ldquo;{testimonial.comment}&rdquo;</p>
                  <p className="font-semibold">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
