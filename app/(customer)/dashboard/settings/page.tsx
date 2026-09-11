import { getProfileData } from "@/features/settings/services";
import SettingsPageClient from "@/features/settings/components/settings-client";

export const metadata = {
  title: "Pengaturan Akun",
  description: "Kelola pengaturan akun Batik Arunika Anda.",
};

export default async function SettingsPage() {
  const initialProfile = await getProfileData().catch(() => ({
    email: "",
    full_name: "",
    phone: "",
  }));

  return <SettingsPageClient initialProfile={initialProfile} />;
}
