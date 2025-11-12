import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/services/wishlist";

export default function Products() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Fetch user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch products and wishlist
  useEffect(() => {
    fetchProducts();
    if (user) fetchWishlist();
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*, profiles(name)")
      .order("created_at", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const fetchWishlist = async () => {
    try {
      const ids = await getWishlist(user.id);
      setWishlist(ids);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please log in to use wishlist");
      return;
    }
    try {
      if (wishlist.includes(productId)) {
        await removeFromWishlist(productId, user.id);
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId, user.id);
        setWishlist(prev => [...prev, productId]);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 section-padding">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-8">All Products</h1>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.images?.[0] || "/placeholder.svg"}
                  seller={product.profiles?.name}
                  isFavorite={wishlist.includes(product.id)}
                  onFavorite={() => toggleWishlist(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
