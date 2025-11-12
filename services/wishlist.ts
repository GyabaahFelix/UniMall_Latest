import { supabase } from "@/integrations/supabase/client";

export const getWishlist = async (userId: string) => {
  const { data, error } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", userId);
  if (error) throw error;
  return data?.map(item => item.product_id) || [];
};

export const addToWishlist = async (productId: string, userId: string) => {
  const { data, error } = await supabase
    .from("wishlists")
    .insert({ product_id: productId, user_id: userId });
  if (error) throw error;
  return data;
};

export const removeFromWishlist = async (productId: string, userId: string) => {
  const { data, error } = await supabase
    .from("wishlists")
    .delete()
    .eq("product_id", productId)
    .eq("user_id", userId);
  if (error) throw error;
  return data;
};
