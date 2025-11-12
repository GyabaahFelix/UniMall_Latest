import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addToCart, getCartItems } from "@/services/cart";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/services/wishlist";
import ProductCard from "@/components/ProductCard";
import { Heart } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

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
    if (!id) return;
    supabase.from("products").select("*").eq("id", id).single().then(({ data }) => { if (data) setProduct(data); });
  }, [id]);

  useEffect(() => {
    if (!product?.category) return;
    supabase.from("products").select("*").eq("category", product.category).neq("id", product.id).limit(4)
      .then(({ data }) => { if (data) setRelatedProducts(data); });
  }, [product]);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

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

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in first");
      navigate("/auth");
      return;
    }
    try {
      await addToCart(product.id, quantity);
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  if (!product) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      <div className="container-custom py-12 flex-1">
        <div className="grid md:grid-cols-2 gap-8">
          <img src={product.images?.[0] || "/placeholder.svg"} alt={product.title} className="w-full rounded-lg shadow-md" />
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <p className="text-lg text-muted-foreground">SKU: {product.sku || "N/A"}</p>
            <p className="text-3xl font-bold text-primary">GH₵{product.price.toFixed(2)}</p>
            <p>{product.description}</p>

            <div className="flex items-center gap-2 mt-4">
              <span>Quantity:</span>
              <Input type="number" min={1} className="w-20" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={handleAddToCart} className="btn-gradient-primary">Add to Cart</Button>
              <Button onClick={() => { handleAddToCart(); navigate("/cart"); }} className="btn-gradient-secondary">Buy Now</Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart className={`h-5 w-5 ${wishlist.includes(product.id) ? "fill-accent text-accent" : ""}`} />
              </Button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  title={p.title}
                  price={p.price}
                  image={p.images?.[0] || "/placeholder.svg"}
                  seller={p.seller}
                  isFavorite={wishlist.includes(p.id)}
                  onFavorite={() => toggleWishlist(p.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
