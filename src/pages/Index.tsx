import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import SlideShow from "@/components/home/SlideShow";
import SalesBanner from "@/components/home/SalesBanner";
import NewProducts from "@/components/home/NewProducts";
import CategoriesSection from "@/components/home/CategoriesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PromotionalBannerSection from "@/components/home/PromotionalBannerSection";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));

    fetchProducts();
    return () => subscription.unsubscribe();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, profiles(name)")
      .order("created_at", { ascending: false })
      .limit(12);

    if (data) setProducts(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <HeroSection />
      <SlideShow />
      <SalesBanner />
      <NewProducts products={products} />
      <CategoriesSection />
      <PromotionalBannerSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
