import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, PackageX, ShoppingBag } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { getProductBySlug } from "@/features/products/services";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  return {
    title: product.name,
    description: product.description ?? `Beli ${product.name} di Batik Arunika.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <Link
            href="/koleksi"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2 pl-0 text-muted-foreground")}
          >
            <ArrowLeft className="size-4" />
            Kembali ke Koleksi
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-border bg-muted p-6">
            <p className="text-center font-medium text-muted-foreground">
              Foto Detail {product.name}
            </p>
          </div>

          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              {product.category ? (
                <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                  {product.category}
                </p>
              ) : null}

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {product.name}
              </h1>

              <p className="text-2xl font-bold text-foreground">
                {formatIDR(product.price)}
              </p>

              <div className="flex items-center gap-2 pt-1 text-sm">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 text-destructive">
                    <PackageX className="size-4" />
                    Stok Habis
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" />
                    Stok Tersedia ({product.stock} pcs)
                  </span>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm font-semibold text-foreground">Deskripsi Produk</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {product.description ?? "Tidak ada deskripsi tersedia untuk produk ini."}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <Button size="lg" className="w-full gap-2" disabled>
                <ShoppingBag className="size-5" />
                {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Pembayaran aman melalui Midtrans Sandbox • Pengiriman via Biteship
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
