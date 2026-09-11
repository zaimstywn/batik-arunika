import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { CategoryCreateForm } from "@/app/admin/categories/category-form";
import { getCategories } from "@/features/products/services";

export const metadata: Metadata = {
  title: "Kelola Kategori",
  description: "Kelola kategori katalog Batik Arunika.",
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories().catch((error: Error) => {
    console.warn(`[admin] Failed to load categories: ${error.message}`);
    return [];
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.5fr]">
      <CategoryCreateForm />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Kategori</CardTitle>
          <CardDescription>
            {categories.length} kategori terdaftar di katalog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <EmptyState
              title="Belum ada kategori"
              message="Tambahkan kategori pertama melalui formulir di samping."
            />
          ) : (
            <ul className="divide-y divide-border rounded-xl border border-border">
              {categories.map((category) => (
                <li key={category.id} className="p-4">
                  <p className="text-sm font-semibold">{category.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    /{category.slug}
                  </p>
                  {category.description ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
