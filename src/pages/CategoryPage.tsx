import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const { slug } = useParams(); // e.g. 'electronics'
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Fetch current user
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // Load category products
      await fetchCategoryProducts();
    };

    init();
  }, [slug]);

  const fetchCategoryProducts = async () => {
    setLoading(true);

    // Convert slug like "home-appliances" -> "home appliances"
    const formattedCategory = slug?.replace(/-/g, " ") || "";
    setCategory(formattedCategory);

    const { data, error } = await supabase
      .from("products")
      .select("*, profiles(name)")
      .ilike("category", formattedCategory);

    if (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} />

      <main className="flex-1 py-12 px-6 sm:px-12 lg:px-20">
        <h1 className="text-4xl font-bold mb-8 text-center capitalize">
          {category || "Category"}
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading products...</p>
        ) : products.length > 0 ? (
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
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">
              No products found in this category.
            </h2>
            <p className="text-gray-600 mb-6">
              Check out other trending items you might like 👇
            </p>

            <RecommendedProducts />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function RecommendedProducts() {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, profiles(name)")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) console.error(error);
      setRecommended(data || []);
      setLoading(false);
    };

    fetchRecommended();
  }, []);

  if (loading) return <p className="text-gray-500">Loading recommendations...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {recommended.map((product) => (
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
  );
}
