"use client";

import { useForm } from "react-hook-form";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { AddressFormData } from "@/features/addresses/services";

type AddressFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddressFormData) => Promise<void>;
  initialData?: AddressFormData;
  isEditing?: boolean;
};

export function AddressForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    defaultValues: initialData ?? {
      recipient_name: "",
      phone: "",
      full_address: "",
      city: "",
      province: "",
      postal_code: "",
      is_default: false,
    },
  });

  const handleFormSubmit = async (data: AddressFormData) => {
    await onSubmit(data);
    reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            {isEditing ? "Edit Alamat" : "Tambah Alamat Baru"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Perbarui detail alamat pengiriman Anda."
              : "Isi detail alamat pengiriman baru Anda."}
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="mt-6 space-y-4"
        >
          <div className="space-y-2">
            <label htmlFor="recipient_name" className="text-sm font-medium">
              Nama Penerima
            </label>
            <Input
              id="recipient_name"
              {...register("recipient_name", {
                required: "Nama penerima wajib diisi",
              })}
              placeholder="John Doe"
            />
            {errors.recipient_name && (
              <p className="text-xs text-destructive">
                {errors.recipient_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Nomor Telepon
            </label>
            <Input
              id="phone"
              {...register("phone", {
                required: "Nomor telepon wajib diisi",
                pattern: {
                  value: /^[\d\s\-+()]+$/,
                  message: "Nomor telepon tidak valid",
                },
              })}
              placeholder="08123456789"
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="full_address" className="text-sm font-medium">
              Alamat Lengkap
            </label>
            <Input
              id="full_address"
              {...register("full_address", {
                required: "Alamat lengkap wajib diisi",
              })}
              placeholder="Jl. Contoh No. 123, RT/RW"
            />
            {errors.full_address && (
              <p className="text-xs text-destructive">
                {errors.full_address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">
                Kota
              </label>
              <Input
                id="city"
                {...register("city", { required: "Kota wajib diisi" })}
                placeholder="Jakarta"
              />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="province" className="text-sm font-medium">
                Provinsi
              </label>
              <Input
                id="province"
                {...register("province", {
                  required: "Provinsi wajib diisi",
                })}
                placeholder="DKI Jakarta"
              />
              {errors.province && (
                <p className="text-xs text-destructive">
                  {errors.province.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="postal_code" className="text-sm font-medium">
              Kode Pos
            </label>
            <Input
              id="postal_code"
              {...register("postal_code", {
                required: "Kode pos wajib diisi",
                pattern: {
                  value: /^\d{5}$/,
                  message: "Kode pos harus 5 digit angka",
                },
              })}
              placeholder="12345"
            />
            {errors.postal_code && (
              <p className="text-xs text-destructive">
                {errors.postal_code.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_default"
              {...register("is_default")}
              className="size-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="is_default" className="text-sm font-normal">
              Jadikan alamat utama
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
