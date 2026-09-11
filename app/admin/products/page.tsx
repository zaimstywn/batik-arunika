import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { ProductCreateForm } from "@/app/admin/products/product-form";
import {
  getAllProductsForAdmin,
  getCategories,
} from "@/features/products/services";
import { formatIDR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Kelola Produk",
  description: "Kelola katalog produk Batik Arunika.",
};

export default async function AdminProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories().catch((error: Error) => {
      console.warn(`[admin] Failed to load categories: ${error.message}`);
      return [];
    }),
    getAllProductsForAdmin().catch((error: Error) => {
      console.warn(`[admin] Failed to load products: ${error.message}`);
      return [];
    }),
  ]);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.6fr]">
      <ProductCreateForm categories={categories} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Produk</CardTitle>
          <CardDescription>
            {products.length} produk terdaftar di katalog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <EmptyState
              title="Belum ada produk"
              message="Tambahkan produk pertama melalui formulir di samping."
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-3xl text-left text-sm">
                <thead className="bg-muted/60 text-xs tracking-wide text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Produk</th>
                    <th className="px-4 py-3 font-semibold">Kategori</th>
                    <th className="px-4 py-3 font-semibold">Harga</th>
                    <th className="px-4 py-3 font-semibold">Stok</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((product) => (
                    <tr key={product.id} className="align-top">
                      <td className="px-4 py-3">
                        <p className="font-semibold">{product.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          /{product.slug}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {product.category ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-semibold whitespace-nowrap">
                        {formatIDR(product.price)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {product.stock} pcs
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {product.is_featured ? (
                            <Badge>Unggulan</Badge>
                          ) : (
                            <Badge variant="outline">Reguler</Badge>
                          )}
                          {product.stock <= 0 ? (
                            <Badge variant="destructive">Habis</Badge>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
