import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Heart, Package, DollarSign } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getOrders } from "@/services/orders";
import { getWishlist } from "@/services/wishlist";
import { getAllProducts } from "@/services/products";

export default function BuyerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Load orders
    const ordersData = await getOrders(session.user.id);
    setOrders(ordersData);
    
    // Calculate total spent
    const total = ordersData.reduce((sum, order) => sum + Number(order.total_amount), 0);
    setTotalSpent(total);

    // Load wishlist
    const wishlistData = await getWishlist(session.user.id);
    setWishlistItems(wishlistData);

    // Load recommended products
    const products = await getAllProducts();
    setRecommendedProducts(products.slice(0, 4));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 section-padding bg-muted/20">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-2">Buyer Dashboard</h1>
          <p className="text-muted-foreground mb-8">Welcome back! Here's your shopping overview.</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Total orders placed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wishlistItems.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Saved for later</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Recently Viewed</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Products viewed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">GH₵{totalSpent.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">All-time spending</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No orders yet. Start shopping!</p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">GH₵{Number(order.total_amount).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Wishlist */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
              <CardDescription>Items you've saved</CardDescription>
            </CardHeader>
            <CardContent>
              {wishlistItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Your wishlist is empty</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {wishlistItems.slice(0, 4).map((item) => (
                    <ProductCard
                      key={item.id}
                      id={item.products.id}
                      title={item.products.title}
                      price={item.products.price}
                      image={item.products.images?.[0] || "/placeholder.svg"}
                      seller={item.products.profiles?.name}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Products */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Products</CardTitle>
              <CardDescription>Products you might like</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map((product) => (
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
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
