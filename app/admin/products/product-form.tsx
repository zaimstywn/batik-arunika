"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createProductAction } from "@/features/products/actions";
import type { Category } from "@/types";

type ProductCreateFormProps = {
  categories: Category[];
};

export function ProductCreateForm({ categories }: ProductCreateFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
      price: Number(formData.get("price") ?? 0),
      stock: Number(formData.get("stock") ?? 0),
      description: String(formData.get("description") ?? ""),
      imageUrl: String(formData.get("imageUrl") ?? ""),
      isFeatured: formData.get("isFeatured") === "on",
    };

    setError(null);
    startTransition(async () => {
      const result = await createProductAction(payload);
      if (!result.success) {
        setError(result.message ?? "Gagal menambah produk.");
        toast.error(result.message ?? "Gagal menambah produk.");
        return;
      }
      formRef.current?.reset();
      toast.success("Produk berhasil ditambahkan.");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Plus className="size-4 text-primary" aria-hidden="true" />
          Tambah Produk
        </CardTitle>
        <CardDescription>
          Slug dibuat otomatis dari nama produk. Gambar cukup berupa URL.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="product-name" className="text-sm font-medium">
              Nama Produk
            </label>
            <Input
              id="product-name"
              name="name"
              placeholder="Contoh: Batik Kawung Senja"
              required
              minLength={2}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="product-category" className="text-sm font-medium">
                Kategori
              </label>
              <select
                id="product-category"
                name="categoryId"
                required
                defaultValue=""
                className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="" disabled>
                  Pilih kategori
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="product-featured" className="text-sm font-medium">
                Unggulan?
              </label>
              <label className="flex h-8 items-center gap-2 rounded-lg border border-input px-2.5 text-sm">
                <input
                  id="product-featured"
                  name="isFeatured"
                  type="checkbox"
                  className="size-4 accent-[#8B5E3C]"
                />
                Tampilkan di beranda
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="product-price" className="text-sm font-medium">
                Harga (IDR)
              </label>
              <Input
                id="product-price"
                name="price"
                type="number"
                min={0}
                step={1000}
                placeholder="349000"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="product-stock" className="text-sm font-medium">
                Stok
              </label>
              <Input
                id="product-stock"
                name="stock"
                type="number"
                min={0}
                step={1}
                placeholder="24"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="product-description" className="text-sm font-medium">
              Deskripsi (opsional)
            </label>
            <Input
              id="product-description"
              name="description"
              placeholder="Deskripsi singkat produk"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="product-image" className="text-sm font-medium">
              URL Gambar (opsional)
            </label>
            <Input
              id="product-image"
              name="imageUrl"
              type="url"
              placeholder="https://contoh.com/foto-batik.jpg"
            />
          </div>

          {error ? (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Menyimpan...
              </>
            ) : (
              "Simpan Produk"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
