import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthWrapper from "./components/AuthWrapper";

// ✅ Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import BuyerDashboard from "./pages/dashboard/BuyerDashboard";
import VendorDashboard from "./pages/dashboard/VendorDashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";
import ProductDetails from "./pages/ProductDetails";
import CategoryPage from "./pages/CategoryPage"; // ✅ Import added

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* 🏠 Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/orders" element={<Orders />} />

          {/* 🛒 Category Page */}
          <Route path="/category/:slug" element={<CategoryPage />} /> {/* ✅ Added route */}

          {/* 🧭 Dashboards */}
          <Route
            path="/buyer/dashboard"
            element={
              <AuthWrapper allowedRoles={["buyer"]}>
                <BuyerDashboard />
              </AuthWrapper>
            }
          />
          <Route
            path="/vendor/dashboard"
            element={
              <AuthWrapper allowedRoles={["seller"]}>
                <VendorDashboard />
              </AuthWrapper>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AuthWrapper allowedRoles={["admin"]}>
                <AdminDashboard />
              </AuthWrapper>
            }
          />

          {/* 🛍 Product Details */}
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* 🚫 Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
