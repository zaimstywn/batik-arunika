export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          Toko Resmi Batik Arunika
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Batik Arunika
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Keindahan Batik Indonesia, dalam Sentuhan Modern.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">
            Fondasi Milestone 1
          </span>
          <span className="rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground">
            Katalog menyusul
          </span>
          <span className="rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground">
            Toko tunggal resmi
          </span>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Halaman ini hanya penanda fondasi desain dan arsitektur. Katalog
          produk, autentikasi, keranjang, checkout, pembayaran, pengiriman,
          pesanan, dan dasbor admin akan dibangun pada milestone berikutnya.
        </p>
      </div>
    </main>
  );
}
