import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const mainCategories = [
  { name: "Electronics", icon: "💻" },
  { name: "Fashion", icon: "👗" },
  { name: "Books", icon: "📚" },
  { name: "Food", icon: "🍕" },
];

const allCategories = [
  { name: "Electronics", icon: "💻" },
  { name: "Fashion", icon: "👗" },
  { name: "Books", icon: "📚" },
  { name: "Food", icon: "🍕" },
  { name: "Hostel Essentials", icon: "🛏️" },
  { name: "Accessories", icon: "⌚" },
];

export default function Navbar({ user }: { user: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout");
    } else {
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background shadow-sm">
      {/* Top Bar */}
      <div className="border-b border-border">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-black border-2 border-black px-4 py-1 rounded">
                UNIMALL
              </div>
            </Link>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </Button>
              </Link>

              {/* Wishlist placeholder, can be removed or implemented later */}
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </Button>
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/account")}>
                      My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/orders")}>
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                      My Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => navigate("/auth")}>Login</Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-6">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>

                  {/* Mobile Categories */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                      Categories
                    </h3>
                    {allCategories.map((category) => (
                      <Link
                        key={category.name}
                        to={`/category/${category.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="flex items-center space-x-2 py-2 text-foreground hover:text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Mobile User Menu */}
                  {user ? (
                    <div className="space-y-2 pt-4 border-t">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          navigate("/account");
                          setMobileMenuOpen(false);
                        }}
                      >
                        My Account
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          navigate("/orders");
                          setMobileMenuOpen(false);
                        }}
                      >
                        My Orders
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          navigate("/wishlist");
                          setMobileMenuOpen(false);
                        }}
                      >
                        My Wishlist
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          navigate("/cart");
                          setMobileMenuOpen(false);
                        }}
                      >
                        My Cart
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        navigate("/auth");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Login / Sign Up
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Secondary Bar - Categories & Search */}
      <div className="border-b border-border bg-muted/20">
        <div className="container-custom">
          <div className="flex items-center gap-4 px-4 md:px-6 py-3">
            {/* Desktop Categories */}
            <div className="hidden md:flex items-center gap-4 flex-1">
              <Link
                to="/products"
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
              >
                All Products
              </Link>
              {mainCategories.map((category) => (
                <Link
                  key={category.name}
                  to={`/category/${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors whitespace-nowrap"
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Desktop Search Bar */}
            <div className="flex-1 md:max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
