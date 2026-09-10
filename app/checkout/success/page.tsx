import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pesanan Berhasil Dibuat",
  description: "Konfirmasi pesanan Batik Arunika Anda.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = typeof params.orderId === "string" ? params.orderId : null;

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <CheckCircle2 className="size-12 text-emerald-600" aria-hidden="true" />
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Pesanan Berhasil Dibuat!
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Terima kasih telah berbelanja di Batik Arunika. Pesanan Anda sedang
              menunggu pembayaran. Instruksi pembayaran Midtrans akan tersedia
              pada milestone berikutnya.
            </p>
            {orderId ? (
              <p className="rounded-lg bg-muted px-4 py-2 font-mono text-xs text-muted-foreground">
                ID Pesanan: {orderId}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/koleksi" className={cn(buttonVariants({ size: "default" }))}>
                Belanja Lagi
              </Link>
              <Link
                href="/profile"
                className={cn(buttonVariants({ variant: "outline", size: "default" }))}
              >
                Lihat Profil
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
