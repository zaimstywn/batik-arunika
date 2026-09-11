import { getCustomerAddresses } from "@/features/addresses/services";
import AddressesPageClient from "@/features/addresses/components/addresses-client";

export const metadata = {
  title: "Buku Alamat",
  description: "Kelola alamat pengiriman Anda.",
};

export default async function AddressesPage() {
  const initialAddresses = await getCustomerAddresses().catch(() => []);

  return <AddressesPageClient initialAddresses={initialAddresses} />;
}
