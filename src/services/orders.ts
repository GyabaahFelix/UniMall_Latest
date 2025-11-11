import { supabase } from "@/integrations/supabase/client";

export interface Order {
  id?: string;
  buyer_id?: string;
  items: any[];
  total_amount: number;
  status?: string;
  created_at?: string;
}

export async function createOrder(items: any[], totalAmount: number) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      buyer_id: session.user.id,
      items,
      total_amount: totalAmount,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("buyer_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getVendorOrders(sellerId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  // Filter orders that contain products from this vendor
  const vendorOrders = data?.filter(order => {
    const items = Array.isArray(order.items) ? order.items : [];
    return items.some((item: any) => item.seller_id === sellerId);
  });

  return vendorOrders || [];
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
