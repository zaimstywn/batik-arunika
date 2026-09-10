import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 py-16 text-center">
      <div className="max-w-md space-y-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          404 — Tidak Ditemukan
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-muted-foreground">
          Maaf, halaman atau produk yang Anda cari tidak tersedia atau sudah dipindahkan.
        </p>
        <div className="pt-4">
          <Link href="/" className={cn(buttonVariants({ size: "default" }))}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
