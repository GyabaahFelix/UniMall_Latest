import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  id?: string;
  user_id?: string;
  product_id: string;
  quantity: number;
}

export async function getCartItems(userId: string) {
  const { data, error } = await supabase
    .from("cart_items")
    .select("*, products(*, profiles(name))")
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

export async function addToCart(productId: string, quantity: number = 1) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Not authenticated");
  }

  // Check if item already exists in cart
  const { data: existing } = await supabase
    .from("cart_items")
    .select()
    .eq("user_id", session.user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        user_id: session.user.id,
        product_id: productId,
        quantity,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFromCart(itemId: string) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", itemId);

  if (error) throw error;
}

export async function clearCart(userId: string) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
}
