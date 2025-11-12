import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/services/wishlist";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchCategoryProducts();
    if (user) fetchWishlist();
  }, [slug, user]);

  const fetchCategoryProducts = async () => {
    setLoading(true);
    const formattedCategory = slug?.replace(/-/g, " ");
    setCategory(formattedCategory ?? "");

    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .ilike("name", formattedCategory ?? "")
        .single();

      let productsData = [];
      if (!categoryError && categoryData) {
        const { data } = await supabase
          .from("products")
          .select("*, profiles(name)")
          .eq("category_id", categoryData.id);
        productsData = data || [];
      } else {
        const { data } = await supabase
          .from("products")
          .select("*, profiles(name)")
          .ilike("category", formattedCategory ?? "");
        productsData = data || [];
      }
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching category:", error);
      setProducts([]);
    }

    setLoading(false);
  };

  const fetchWishlist = async () => {
    try {
      const ids = await getWishlist(user.id);
      setWishlist(ids);
    } catch {}
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) return toast.error("Please log in to use wishlist");
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
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <section className="section-padding container-custom">
        <h1 className="text-4xl font-bold mb-6 capitalize">{category || "Category"}</h1>
        {loading ? (
          <p className="text-muted-foreground text-center">Loading products...</p>
        ) : products.length > 0 ? (
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
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">No products found in this category.</h2>
            <p className="text-muted-foreground mb-6">Check out other trending items you might like 👇</p>
            <RecommendedProducts wishlist={wishlist} toggleWishlist={toggleWishlist} />
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

function RecommendedProducts({ wishlist, toggleWishlist }: { wishlist: string[]; toggleWishlist: (id: string) => void }) {
  const [recommended, setRecommended] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const fetchRecommended = async () => {
      const { data } = await supabase
        .from("products")
        .select("*, profiles(name)")
        .order("created_at", { ascending: false })
        .limit(4);
      if (data) setRecommended(data);
    };
    fetchRecommended();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {recommended.map(product => (
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
  );
}
