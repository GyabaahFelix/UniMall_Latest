import { supabase } from "@/integrations/supabase/client";

export async function getWishlist(userId: string) {
  const { data, error } = await supabase
    .from("wishlists")
    .select("*, products(*, profiles(name))")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

export async function addToWishlist(productId: string) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("wishlists")
    .insert({
      user_id: session.user.id,
      product_id: productId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFromWishlist(productId: string) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", session.user.id)
    .eq("product_id", productId);

  if (error) throw error;
}

export async function isInWishlist(productId: string, userId: string) {
  const { data, error } = await supabase
    .from("wishlists")
    .select()
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return !!data;
}
