import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { ProductCard } from "@/components/products/product-card";
import { getCategories, getProducts } from "@/features/products/services";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Koleksi Batik",
  description: "Jelajahi seluruh koleksi batik resmi dari Batik Arunika.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function KoleksiPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const categorySlug =
    typeof resolvedParams.kategori === "string" ? resolvedParams.kategori : undefined;
  const search =
    typeof resolvedParams.q === "string" ? resolvedParams.q : undefined;

  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({ categorySlug, search }).catch(() => []),
  ]);

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <header className="space-y-2">
          <Badge>Katalog Resmi</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Koleksi Batik Arunika
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Temukan batik berkualitas tinggi dengan sentuhan modern untuk setiap
            momen istimewa Anda.
          </p>
        </header>

        <section className="mt-8 space-y-4" aria-label="Filter kategori">
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
            <Link
              href="/koleksi"
              className={cn(
                buttonVariants({
                  variant: !categorySlug ? "default" : "outline",
                  size: "sm",
                })
              )}
            >
              Semua
            </Link>
            {categories.map((cat) => {
              const isActive = categorySlug === cat.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/koleksi?kategori=${cat.slug}`}
                  className={cn(
                    buttonVariants({
                      variant: isActive ? "default" : "outline",
                      size: "sm",
                    })
                  )}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8" aria-label="Daftar produk">
          {products.length === 0 ? (
            <EmptyState
              title="Produk tidak ditemukan"
              message="Tidak ada batik yang sesuai dengan kategori atau pencarian ini."
              action={
                <Link href="/koleksi" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                  Lihat Semua Koleksi
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
