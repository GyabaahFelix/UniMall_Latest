import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function Wishlist() {
  const [user, setUser] = useState<any>(null);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      <section className="section-padding flex-1">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

          {wishlistItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-6">Save your favorite items here</p>
                <Link to="/products">
                  <Button>Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.products?.id}
                  title={item.products?.title}
                  price={item.products?.price}
                  image={item.products?.images?.[0] || "/placeholder.svg"}
                  seller={item.products?.profiles?.name}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
