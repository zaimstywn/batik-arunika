import Link from "next/link";
import { siteConfig } from "@/constants/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-base font-bold tracking-tight">{siteConfig.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <p className="mt-3 text-xs text-muted-foreground italic">
              &ldquo;Keindahan Batik Indonesia, dalam Sentuhan Modern.&rdquo;
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wide text-foreground">Bantuan & Layanan</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/#tentang" className="transition-colors hover:text-foreground">
                  Bantuan Pelanggan
                </Link>
              </li>
              <li>
                <Link href="/#tentang" className="transition-colors hover:text-foreground">
                  Informasi Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/#tentang" className="transition-colors hover:text-foreground">
                  Kebijakan Pengembalian
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-wide text-foreground">Kontak Kami</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>{siteConfig.email}</li>
              <li>Yogyakarta, Indonesia</li>
              <li className="text-xs text-muted-foreground">
                Senin – Sabtu, 09:00 – 17:00 WIB
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/70 pt-6 text-center text-xs text-muted-foreground">
          <p>© {currentYear} {siteConfig.name}. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
