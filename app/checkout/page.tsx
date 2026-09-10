"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, MapPin, Package, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/common/loading-state";
import { createOrderAction } from "@/features/checkout/actions";
import { addressSchema, type AddressInput } from "@/features/checkout/schemas";
import { useCartStore, useCartSubtotal } from "@/features/cart/store";
import { formatIDR } from "@/lib/format";

const FLAT_SHIPPING_COST = 20000;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartSubtotal();
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      recipientName: "",
      phone: "",
      fullAddress: "",
      city: "",
      province: "",
      postalCode: "",
    },
  });

  useEffect(() => {
    if (isMounted && items.length === 0) {
      router.replace("/keranjang");
    }
  }, [isMounted, items.length, router]);

  if (!isMounted || items.length === 0) {
    return (
      <main className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <LoadingState message="Memuat halaman checkout..." />
        </div>
      </main>
    );
  }

  const grandTotal = subtotal + FLAT_SHIPPING_COST;

  const onSubmit = async (addressValues: AddressInput) => {
    const payload = {
      address: addressValues,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
      shippingCost: FLAT_SHIPPING_COST,
    };

    const result = await createOrderAction(payload);

    if (!result.success) {
      toast.error(result.message ?? "Gagal memproses pesanan.");
      return;
    }

    clearCart();
    toast.success("Pesanan berhasil dibuat!");
    router.replace(`/checkout/success?orderId=${result.orderId ?? ""}`);
  };

  return (
    <main className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Checkout Pesanan</h1>
          <p className="text-sm text-muted-foreground">
            Lengkapi alamat pengiriman dan periksa kembali pesanan Anda.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="size-4 text-primary" aria-hidden="true" />
                  Alamat Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="recipientName" className="text-sm font-medium">
                      Nama Penerima
                    </label>
                    <Input
                      id="recipientName"
                      placeholder="Nama lengkap"
                      aria-invalid={!!errors.recipientName}
                      {...register("recipientName")}
                    />
                    {errors.recipientName ? (
                      <p className="text-xs text-destructive">{errors.recipientName.message}</p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Nomor Telepon
                    </label>
                    <Input
                      id="phone"
                      placeholder="08123456789"
                      aria-invalid={!!errors.phone}
                      {...register("phone")}
                    />
                    {errors.phone ? (
                      <p className="text-xs text-destructive">{errors.phone.message}</p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="fullAddress" className="text-sm font-medium">
                    Alamat Lengkap
                  </label>
                  <Input
                    id="fullAddress"
                    placeholder="Nama jalan, nomor rumah, RT/RW, patokan"
                    aria-invalid={!!errors.fullAddress}
                    {...register("fullAddress")}
                  />
                  {errors.fullAddress ? (
                    <p className="text-xs text-destructive">{errors.fullAddress.message}</p>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label htmlFor="city" className="text-sm font-medium">
                      Kota / Kabupaten
                    </label>
                    <Input
                      id="city"
                      placeholder="Contoh: Yogyakarta"
                      aria-invalid={!!errors.city}
                      {...register("city")}
                    />
                    {errors.city ? (
                      <p className="text-xs text-destructive">{errors.city.message}</p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="province" className="text-sm font-medium">
                      Provinsi
                    </label>
                    <Input
                      id="province"
                      placeholder="Contoh: DI Yogyakarta"
                      aria-invalid={!!errors.province}
                      {...register("province")}
                    />
                    {errors.province ? (
                      <p className="text-xs text-destructive">{errors.province.message}</p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="postalCode" className="text-sm font-medium">
                      Kode Pos
                    </label>
                    <Input
                      id="postalCode"
                      placeholder="55111"
                      maxLength={5}
                      aria-invalid={!!errors.postalCode}
                      {...register("postalCode")}
                    />
                    {errors.postalCode ? (
                      <p className="text-xs text-destructive">{errors.postalCode.message}</p>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="size-4 text-primary" aria-hidden="true" />
                  Metode Pengiriman (Biteship)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-muted/30">
                  <div>
                    <p className="text-sm font-semibold">Reguler (Biteship Mock)</p>
                    <p className="text-xs text-muted-foreground">Estimasi tiba 2–3 hari kerja</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {formatIDR(FLAT_SHIPPING_COST)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside aria-label="Ringkasan pembayaran">
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle className="text-base">Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between gap-2 text-sm">
                      <span className="line-clamp-1 text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium text-foreground">
                        {formatIDR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal Produk</span>
                    <span className="font-semibold text-foreground">{formatIDR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Biaya Pengiriman</span>
                    <span className="font-semibold text-foreground">{formatIDR(FLAT_SHIPPING_COST)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
                    <span>Total Tagihan</span>
                    <span className="text-primary">{formatIDR(grandTotal)}</span>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" />
                      Membuat Pesanan...
                    </>
                  ) : (
                    <>
                      Buat Pesanan
                      <ArrowRight />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="size-4 text-emerald-600" aria-hidden="true" />
                  <span>Transaksi aman & terverifikasi server</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </form>
      </div>
    </main>
  );
}
