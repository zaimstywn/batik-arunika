import { redirect } from "next/navigation";
import { MapPin, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Profil",
  description: "Kelola akun Batik Arunika Anda.",
};

export default async function ProfilePage() {
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
    <main className="bg-background">
      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Halo, {displayName}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <LogoutButton />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                Buku Alamat
              </CardTitle>
              <CardDescription>Kelola alamat pengiriman Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="Belum ada alamat tersimpan"
                message="Fitur buku alamat akan hadir pada milestone berikutnya."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="size-4 text-primary" aria-hidden="true" />
                Riwayat Pesanan
              </CardTitle>
              <CardDescription>Pantau status pesanan Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="Belum ada pesanan"
                message="Riwayat pesanan Anda akan tampil di sini setelah checkout."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
