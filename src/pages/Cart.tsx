import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getCartItems, removeFromCart, updateCartItemQuantity } from "@/services/cart";

export default function Cart() {
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const navigate = useNavigate();

  // Fetch cart items
  const fetchCart = async () => {
    if (!user) return;
    try {
      const items = await getCartItems(user.id);
      setCartItems(items || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    }
  };

  useEffect(() => {
    // Get user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch cart whenever user changes
  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const handleRemove = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      toast.success("Item removed from cart");
      fetchCart(); // refresh cart
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateCartItemQuantity(itemId, quantity);
      fetchCart(); // refresh cart
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.products?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      <section className="section-padding flex-1">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Trash2 className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Start shopping to add items to your cart
                </p>
                <Link to="/products">
                  <Button>Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="flex gap-4 p-4">
                      <img
                        src={item.products?.images?.[0] || "/placeholder.svg"}
                        alt={item.products?.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.products?.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                          >
                            -
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          GH₵{(item.products?.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>GH₵{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total</span>
                        <span>GH₵{total.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button className="w-full btn-gradient-primary">
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
