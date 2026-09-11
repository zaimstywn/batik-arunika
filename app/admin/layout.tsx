import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, Tags } from "lucide-react";

const adminLinks = [
  { label: "Ringkasan", href: "/admin", icon: LayoutDashboard },
  { label: "Pesanan", href: "/admin/orders", icon: ShoppingBag },
  { label: "Produk", href: "/admin/products", icon: Package },
  { label: "Kategori", href: "/admin/categories", icon: Tags },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <header className="space-y-1">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Panel Admin
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Kelola Toko Arunika</h1>
        </header>

        <nav
          aria-label="Navigasi admin"
          className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4"
        >
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <link.icon className="size-4" aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
