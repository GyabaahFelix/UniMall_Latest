import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${query}%`); // case-insensitive search

      if (error) console.error(error);
      else setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, [query]);

  return (
    <div className="container-custom py-8">
      <h2 className="text-xl font-semibold mb-4">
        Search results for "{query}"
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found matching "{query}".</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="border p-4 rounded-md hover:shadow-md transition-shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover mb-2 rounded-md"
              />
              <h3 className="font-medium">{product.name}</h3>
              <p className="font-semibold mt-1">${product.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
