import Link from "next/link";
import { ArrowRight, Shirt, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { ProductCard } from "@/components/products/product-card";
import { homepageCategories, homepageProducts } from "@/constants/homepage";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
          <div>
            <Badge>Toko Resmi Batik Arunika</Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Keindahan Batik Indonesia, dalam Sentuhan Modern.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Koleksi batik pilihan dari satu merek resmi. Hangat, elegan, dan
              nyaman dipakai untuk acara maupun aktivitas harian.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="#koleksi" className={cn(buttonVariants({ size: "lg" }))}>
                Lihat Koleksi
                <ArrowRight />
              </Link>
              <Link
                href="#tentang"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Tentang Arunika
              </Link>
            </div>
          </div>

          <Card className="bg-card">
            <div className="flex min-h-64 flex-col items-start justify-center gap-3 p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Koleksi Pilihan Musim Ini
              </span>
              <p className="text-2xl font-bold tracking-tight">
                Batik Kawung Arunika
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Motif klasik kawung dengan palet hangat modern. Placeholder
                visual katalog sebelum foto produk resmi tersedia.
              </p>
              <Button variant="ghost" size="sm" type="button" disabled>
                Pratinjau katalog
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="kategori">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Kategori Unggulan
            </p>
            <h2 id="kategori" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Jelajahi Koleksi
            </h2>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {homepageCategories.map((category) => (
            <Card key={category.id} className="p-6">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shirt className="size-5" aria-hidden="true" />
              </span>
              <CardTitle className="mt-4">{category.name}</CardTitle>
              <CardDescription className="mt-1">
                {category.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </section>

      <section id="koleksi" className="border-y border-border bg-card" aria-labelledby="Koleksi terbaru">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                Produk Pilihan
              </p>
              <h2 id="Koleksi terbaru" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Koleksi Terbaru
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Data contoh statis untuk fondasi tampilan. Katalog dinamis akan
                hadir pada milestone berikutnya.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {homepageProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="tentang" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16" aria-labelledby="Cerita merek">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Cerita Merek
            </p>
            <h2 id="Cerita merek" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Merawat tradisi, merancang masa kini.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Batik Arunika menghadirkan batik sebagai pakaian sehari-hari yang
              modern tanpa kehilangan akar budayanya. Setiap koleksi dirancang
              agar mudah dipadukan, nyaman dipakai, dan relevan untuk gaya
              hidup masa kini.
            </p>
          </div>
          <Card className="border-accent/25 bg-accent/5 p-6">
            <CardTitle className="text-base">Komitmen toko resmi</CardTitle>
            <CardDescription className="mt-2 leading-relaxed">
              Produk original dari satu merek, kualitas bahan yang konsisten,
              dan layanan pelanggan langsung dari tim Batik Arunika.
            </CardDescription>
          </Card>
        </div>
      </section>
    </main>
  );
}
