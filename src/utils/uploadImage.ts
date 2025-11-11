import { supabase } from "@/integrations/supabase/client";

export async function uploadProductImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  try {
    const fileName = imageUrl.split("/").pop();
    if (!fileName) return;

    const { error } = await supabase.storage
      .from("product-images")
      .remove([fileName]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}
