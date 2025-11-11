import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addToCart, getCartItems } from "@/services/cart";
import ProductCard from "@/components/ProductCard";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Get current user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch product details
  useEffect(() => {
    if (!id) return;
    supabase.from("products").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setProduct(data);
    });
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (!product?.category) return;
    supabase
      .from("products")
      .select("*")
      .eq("category", product.category)
      .neq("id", product.id)
      .limit(4)
      .then(({ data }) => { if (data) setRelatedProducts(data); });
  }, [product]);

  // Fetch cart count
  const fetchCartCount = async () => {
    if (!user) return;
    try {
      const items = await getCartItems(user.id);
      setCartCount(items?.reduce((acc, i) => acc + i.quantity, 0) || 0);
    } catch {}
  };
  useEffect(() => { fetchCartCount(); }, [user]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in first");
      navigate("/auth");
      return;
    }
    try {
      await addToCart(product.id, quantity);
      toast.success("Added to cart");
      fetchCartCount();
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
            </div>

            <div className="mt-10 space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Product Info</h2>
                <p>{product.additional_info || "No extra info provided."}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Return & Refund Policy</h2>
                <p>{product.return_policy || "Refer to our store policy."}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Shipping Info</h2>
                <p>{product.shipping_info || "Ships within 3-5 business days."}</p>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => <ProductCard key={p.id} id={p.id} title={p.title} price={p.price} image={p.images?.[0] || "/placeholder.svg"} seller={p.seller} />)}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
