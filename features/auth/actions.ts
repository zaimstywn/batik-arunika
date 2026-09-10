"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/features/auth/schemas";
import { createClient } from "@/lib/supabase/server";

export type AuthActionResult = {
  success: boolean;
  message?: string;
};

export async function loginAction(values: unknown): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "Input tidak valid";
    return { success: false, message: errorMsg };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    let message = "Gagal masuk. Periksa email dan password Anda.";
    if (error.message.includes("Invalid login credentials")) {
      message = "Email atau password salah.";
    } else if (error.message.includes("Email not confirmed")) {
      message = "Email belum dikonfirmasi. Periksa kotak masuk Anda.";
    }
    return { success: false, message };
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function registerAction(values: unknown): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "Input tidak valid";
    return { success: false, message: errorMsg };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.name,
      },
    },
  });

  if (error) {
    let message = "Gagal mendaftar. Silakan coba lagi.";
    if (
      error.message.toLowerCase().includes("already registered") ||
      error.message.toLowerCase().includes("user_already_exists")
    ) {
      message = "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.";
    }
    return { success: false, message };
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect("/profile");
  }

  return {
    success: true,
    message: "Pendaftaran berhasil! Silakan periksa email Anda untuk konfirmasi jika diperlukan.",
  };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
