import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  category_id?: string;
  images: string[];
  condition?: string;
  seller_id?: string;
  featured?: boolean;
}

export async function createProduct(product: Product) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...product,
      seller_id: session.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function getVendorProducts(sellerId: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAllProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*, profiles(name)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
