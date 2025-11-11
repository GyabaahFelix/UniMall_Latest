import { supabase } from "@/integrations/supabase/client";

export async function getAllUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, user_roles(role)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: string, role: "admin" | "buyer" | "seller") {
  // First check if role exists
  const { data: existing } = await supabase
    .from("user_roles")
    .select()
    .eq("user_id", userId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from("user_roles")
      .update({ role })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from("user_roles")
      .insert([{ user_id: userId, role }] as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
