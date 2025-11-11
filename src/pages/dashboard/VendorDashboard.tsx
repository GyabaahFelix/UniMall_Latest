import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Package, DollarSign, TrendingUp, ShoppingCart, Plus } from "lucide-react";
import { getVendorProducts, deleteProduct, createProduct } from "@/services/products";
import { getVendorOrders } from "@/services/orders";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { uploadProductImage } from "@/utils/uploadImage";

export default function VendorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadVendorData();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (!error) setCategories(data);
  };

  const loadVendorData = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    const productsData = await getVendorProducts(session.user.id);
    setProducts(productsData);

    const ordersData = await getVendorOrders(session.user.id);
    setOrders(ordersData);

    const total = ordersData.reduce((sum, order) => sum + Number(order.total_amount), 0);
    setTotalEarnings(total);

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
      const imageFiles = formData.getAll("images") as File[];

      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        if (file && file.size > 0) {
          const url = await uploadProductImage(file);
          imageUrls.push(url);
        }
      }

      let categoryId = formData.get("category") as string;

      // If a new category is added
      if (newCategory.trim() !== "") {
        const { data: insertedCategory, error } = await supabase
          .from("categories")
          .insert({ name: newCategory.trim() })
          .select()
          .single();

        if (error) throw new Error(error.message);
        categoryId = insertedCategory.id;
        setNewCategory(""); // reset input
        loadCategories(); // refresh categories list
      }

      const productData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        category_id: categoryId,
        condition: formData.get("condition") as string,
        contact: formData.get("contact") as string,
        location: formData.get("location") as string,
        images: imageUrls,
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
        <div className="container-custom max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl sm:text-4xl font-bold mb-1">Vendor Dashboard</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Manage your products and sales</p>
            </div>

            <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-2xl">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <Label htmlFor="category">Category</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        id="category"
                        name="category"
                        className="input flex-1"
                        defaultValue=""
                      >
                        <option value="">Select existing category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <Input
                        placeholder="Or create new category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Info</Label>
                      <Input id="contact" name="contact" placeholder="Phone or email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" placeholder="City, Area, etc." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="images">Product Images</Label>
                    <Input id="images" name="images" type="file" accept="image/*" multiple />
                  </div>

                  <Button type="submit" className="w-full" disabled={uploading}>
                    {uploading ? "Uploading..." : "Add Product"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          {/* Products List */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Manage My Products</CardTitle>
              <CardDescription>View and manage your listed products</CardDescription>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No products listed yet.</p>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                      <div className="flex items-center gap-4 flex-1 flex-wrap">
                        {product.images?.map((img: string, i: number) => (
                          <img key={i} src={img} alt={product.title} className="w-16 h-16 object-cover rounded" />
                        ))}
                        <div>
                          <p className="font-medium">{product.title}</p>
                          <p className="text-sm text-muted-foreground">GH₵{product.price}</p>
                          <p className="text-xs text-muted-foreground">{product.contact}</p>
                          <p className="text-xs text-muted-foreground">{product.location}</p>
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

        </div>
      </main>

      <Footer />
    </div>
  );
}
