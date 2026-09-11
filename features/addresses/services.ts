"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Address } from "@/types";

export type AddressFormData = {
  recipient_name: string;
  phone: string;
  full_address: string;
  city: string;
  province: string;
  postal_code: string;
  is_default?: boolean;
};

export type AddressActionResult = {
  success: boolean;
  error?: string;
  data?: Address;
};

export async function getCustomerAddresses(): Promise<Address[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("addresses")
    .select(
      "id, user_id, recipient_name, phone, full_address, city, province, postal_code, created_at"
    )
    .is("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch addresses:", error.message);
    return [];
  }

  return (data ?? []) as Address[];
}

export async function createAddress(
  formData: AddressFormData
): Promise<AddressActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Anda harus masuk terlebih dahulu." };
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: user.id,
      recipient_name: formData.recipient_name.trim(),
      phone: formData.phone.trim(),
      full_address: formData.full_address.trim(),
      city: formData.city.trim(),
      province: formData.province.trim(),
      postal_code: formData.postal_code.trim(),
      is_default: formData.is_default ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create address:", error.message);
    return { success: false, error: "Gagal menyimpan alamat. Silakan coba lagi." };
  }

  revalidatePath("/dashboard/addresses");
  return { success: true, data: data as Address };
}

export async function updateAddress(
  addressId: string,
  formData: AddressFormData
): Promise<AddressActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Anda harus masuk terlebih dahulu." };
  }

  const { data, error } = await supabase
    .from("addresses")
    .update({
      recipient_name: formData.recipient_name.trim(),
      phone: formData.phone.trim(),
      full_address: formData.full_address.trim(),
      city: formData.city.trim(),
      province: formData.province.trim(),
      postal_code: formData.postal_code.trim(),
      is_default: formData.is_default ?? false,
    })
    .eq("id", addressId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update address:", error.message);
    return { success: false, error: "Gagal memperbarui alamat. Silakan coba lagi." };
  }

  revalidatePath("/dashboard/addresses");
  return { success: true, data: data as Address };
}

export async function deleteAddress(
  addressId: string
): Promise<AddressActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Anda harus masuk terlebih dahulu." };
  }

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete address:", error.message);
    return { success: false, error: "Gagal menghapus alamat. Silakan coba lagi." };
  }

  revalidatePath("/dashboard/addresses");
  return { success: true };
}

export async function setDefaultAddress(
  addressId: string
): Promise<AddressActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Anda harus masuk terlebih dahulu." };
  }

  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to set default address:", error.message);
    return { success: false, error: "Gagal mengatur alamat utama. Silakan coba lagi." };
  }

  revalidatePath("/dashboard/addresses");
  return { success: true };
}
