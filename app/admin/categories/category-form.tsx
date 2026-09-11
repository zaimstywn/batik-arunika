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
import { createCategoryAction } from "@/features/products/actions";

export function CategoryCreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
    };

    setError(null);
    startTransition(async () => {
      const result = await createCategoryAction(payload);
      if (!result.success) {
        setError(result.message ?? "Gagal menambah kategori.");
        toast.error(result.message ?? "Gagal menambah kategori.");
        return;
      }
      formRef.current?.reset();
      toast.success("Kategori berhasil ditambahkan.");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Plus className="size-4 text-primary" aria-hidden="true" />
          Tambah Kategori
        </CardTitle>
        <CardDescription>
          Slug dibuat otomatis dari nama kategori.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="category-name" className="text-sm font-medium">
              Nama Kategori
            </label>
            <Input
              id="category-name"
              name="name"
              placeholder="Contoh: Batik Anak"
              required
              minLength={2}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="category-description" className="text-sm font-medium">
              Deskripsi (opsional)
            </label>
            <Input
              id="category-description"
              name="description"
              placeholder="Deskripsi singkat kategori"
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
              "Simpan Kategori"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
