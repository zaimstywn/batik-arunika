"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type NewsletterActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function subscribeToNewsletter(
  email: string
): Promise<NewsletterActionResult> {
  // Email validation with regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Email tidak valid." };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: email.toLowerCase().trim() });

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Email sudah terdaftar dalam newsletter." };
    }
    console.error("Failed to subscribe to newsletter:", error.message);
    return { success: false, error: "Gagal mendaftar newsletter. Silakan coba lagi." };
  }

  revalidatePath("/");
  return { 
    success: true, 
    message: "Terima kasih! Anda berhasil mendaftar newsletter kami." 
  };
}
