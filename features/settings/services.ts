"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileUpdateData = {
  full_name: string;
  phone?: string;
};

export type PasswordUpdateData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type SettingsActionResult = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function getProfileData(): Promise<{
  email: string;
  full_name?: string;
  phone?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { email: "", full_name: "", phone: "" };
  }

  return {
    email: user.email ?? "",
    full_name: user.user_metadata?.full_name as string | undefined,
    phone: user.user_metadata?.phone as string | undefined,
  };
}

export async function updateProfile(
  data: ProfileUpdateData
): Promise<SettingsActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Anda harus masuk terlebih dahulu." };
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: data.full_name.trim(),
      phone: data.phone?.trim() || null,
    },
  });

  if (error) {
    console.error("Failed to update profile:", error.message);
    return { success: false, error: "Gagal memperbarui profil." };
  }

  revalidatePath("/dashboard/settings");
  return { success: true, message: "Profil berhasil diperbarui." };
}

export async function updatePassword(
  data: PasswordUpdateData
): Promise<SettingsActionResult> {
  if (data.newPassword !== data.confirmPassword) {
    return { success: false, error: "Password baru tidak cocok." };
  }

  if (data.newPassword.length < 8) {
    return { success: false, error: "Password minimal 8 karakter." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Anda harus masuk terlebih dahulu." };
  }

  // First, verify current password by signing in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: data.currentPassword,
  });

  if (signInError) {
    return { success: false, error: "Password saat ini salah." };
  }

  // Update to new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: data.newPassword,
  });

  if (updateError) {
    console.error("Failed to update password:", updateError.message);
    return { success: false, error: "Gagal memperbarui password." };
  }

  return { success: true, message: "Password berhasil diperbarui." };
}
