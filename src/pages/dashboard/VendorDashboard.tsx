import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Package, DollarSign, TrendingUp, ShoppingCart, Plus } from "lucide-react";
import { getVendorProducts, deleteProduct } from "@/services/products";
import { getVendorOrders } from "@/services/orders";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { uploadProductImage } from "@/utils/uploadImage";
import { createProduct } from "@/services/products";

export default function VendorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Load vendor products
    const productsData = await getVendorProducts(session.user.id);
    setProducts(productsData);

    // Load vendor orders
    const ordersData = await getVendorOrders(session.user.id);
    setOrders(ordersData);
    
    // Calculate earnings
    const total = ordersData.reduce((sum, order) => sum + Number(order.total_amount), 0);
    setTotalEarnings(total);

    // Calculate this month's earnings
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyOrdersTotal = ordersData
      .filter(order => new Date(order.created_at) >= monthStart)
      .reduce((sum, order) => sum + Number(order.total_amount), 0);
    setMonthlyEarnings(monthlyOrdersTotal);
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const imageFile = formData.get("image") as File;
      
      let imageUrl = "";
      if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadProductImage(imageFile);
      }

      const productData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        images: imageUrl ? [imageUrl] : [],
        condition: formData.get("condition") as string,
      };

      await createProduct(productData);
      toast.success("Product added successfully!");
      setIsAddingProduct(false);
      loadVendorData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add product");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully!");
      loadVendorData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 section-padding bg-muted/20">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Vendor Dashboard</h1>
              <p className="text-muted-foreground">Manage your products and sales</p>
            </div>
            <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Fill in the details to list your product</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (GH₵)</Label>
                      <Input id="price" name="price" type="number" step="0.01" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Input id="condition" name="condition" placeholder="e.g., New, Like New" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Product Image</Label>
                    <Input id="image" name="image" type="file" accept="image/*" />
                  </div>
                  <Button type="submit" className="w-full" disabled={uploading}>
                    {uploading ? "Uploading..." : "Add Product"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Total listed products</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Orders received</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">GH₵{totalEarnings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">All-time revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">This Month's Earnings</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">GH₵{monthlyEarnings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Current month revenue</p>
              </CardContent>
            </Card>
          </div>

          {/* Manage Products */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Manage My Products</CardTitle>
              <CardDescription>View and manage your listed products</CardDescription>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No products listed yet. Add your first product!</p>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {product.images?.[0] && (
                          <img src={product.images[0]} alt={product.title} className="w-16 h-16 object-cover rounded" />
                        )}
                        <div>
                          <p className="font-medium">{product.title}</p>
                          <p className="text-sm text-muted-foreground">GH₵{product.price}</p>
                        </div>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Orders containing your products</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No orders yet</p>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
