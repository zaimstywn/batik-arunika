import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Status Pesanan",
  description: "Konfirmasi status pesanan Batik Arunika Anda.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const statusCopy: Record<string, { title: string; message: string }> = {
  success: {
    title: "Pembayaran Berhasil!",
    message:
      "Terima kasih telah berbelanja di Batik Arunika. Pesanan Anda sedang diproses oleh tim kami.",
  },
  pending: {
    title: "Menunggu Pembayaran",
    message:
      "Pesanan Anda sudah dibuat. Selesaikan pembayaran sebelum batas waktu agar tidak dibatalkan otomatis.",
  },
  error: {
    title: "Pembayaran Gagal",
    message:
      "Terjadi kendala saat pembayaran. Pesanan tetap tercatat; silakan coba lagi atau hubungi kami.",
  },
  closed: {
    title: "Jendela Pembayaran Ditutup",
    message:
      "Pesanan Anda sudah dibuat dan menunggu pembayaran. Status resmi akan diperbarui melalui webhook Midtrans.",
  },
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = typeof params.orderId === "string" ? params.orderId : null;
  const status = typeof params.status === "string" ? params.status : null;
  const copy =
    (status ? statusCopy[status] : undefined) ?? {
      title: "Pesanan Berhasil Dibuat!",
      message:
        "Terima kasih telah berbelanja di Batik Arunika. Status pembayaran resmi mengikuti konfirmasi webhook Midtrans.",
    };

  const icon =
    status === "success" ? (
      <CheckCircle2 className="size-12 text-emerald-600" aria-hidden="true" />
    ) : status === "pending" || status === "closed" || !status ? (
      <Clock className="size-12 text-amber-600" aria-hidden="true" />
    ) : (
      <XCircle className="size-12 text-destructive" aria-hidden="true" />
    );

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            {icon}
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {copy.title}
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">{copy.message}</p>
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
