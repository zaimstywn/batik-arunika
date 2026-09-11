import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, LayoutDashboard, MapPin, Package, Settings, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const customerLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Riwayat Pesanan", href: "/dashboard/orders", icon: Package },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { label: "Buku Alamat", href: "/dashboard/addresses", icon: MapPin },
  { label: "Pengaturan Akun", href: "/dashboard/settings", icon: Settings },
];

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    typeof user.user_metadata?.full_name === "string" &&
    user.user_metadata.full_name.trim().length > 0
      ? user.user_metadata.full_name
      : "Pelanggan Arunika";

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <header className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <User className="size-4" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em]">
              Akun Saya
            </p>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Halo, {displayName}
          </h1>
        </header>

        <nav
          aria-label="Navigasi dashboard"
          className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4"
        >
          {customerLinks.map((link) => (
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
