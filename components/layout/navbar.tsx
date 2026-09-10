import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { siteConfig } from "@/constants/site";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Koleksi", href: "/koleksi" },
  { label: "Tentang Kami", href: "/#tentang" },
];

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const accountHref = user ? "/profile" : "/login";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigasi utama">
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/#koleksi"
            aria-label="Cari produk"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <Search />
          </Link>
          <Link
            href={accountHref}
            aria-label={user ? "Profil saya" : "Masuk ke akun"}
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
          >
            <User />
          </Link>
          <Link
            href="/#koleksi"
            aria-label="Keranjang"
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
          >
            <ShoppingBag />
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]">
              0
            </Badge>
          </Link>

          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  );
}
