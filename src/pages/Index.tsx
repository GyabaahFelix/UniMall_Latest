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
import ProductSpotlight from "@/components/ProductSpotlight";
import ShopTheBestDeals from "@/components/ShopTheBestDeals";
import FastDeliveryBanner from "@/components/FastDeliveryBanner";
import BecomeVendorBanner from "@/components/BecomeVendorBanner";

export default function Index() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [spotlights, setSpotlights] = useState<any[]>([]);
  const [loadingSpotlights, setLoadingSpotlights] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setUser(session?.user ?? null));

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    fetchProducts();
    fetchSpotlights();

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

  const fetchSpotlights = async () => {
    setLoadingSpotlights(true);

    const { data, error } = await supabase
      .from("product_spotlights")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setSpotlights(data);

    setLoadingSpotlights(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      <HeroSection />
      <SlideShow />

      {/* Shop the Best Deals */}
      <ShopTheBestDeals />

      {/* Product Spotlight Section */}
      <ProductSpotlight spotlights={spotlights} loading={loadingSpotlights} />

      {/* Sales Banner */}
      <SalesBanner />

      {/* New Products */}
      <NewProducts products={products} />

      {/* Become a Vendor Banner */}
      <BecomeVendorBanner />

      {/* Categories */}
      <CategoriesSection />

      {/* Fast Delivery Banner */}
      <FastDeliveryBanner />

      {/* Promotional + Testimonials */}
      <PromotionalBannerSection />
      <TestimonialsSection />

      <Footer />
    </div>
  );
}
