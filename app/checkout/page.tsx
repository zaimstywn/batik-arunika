"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, MapPin, Package, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/common/loading-state";
import { createOrderAction } from "@/features/checkout/actions";
import { addressSchema, type AddressInput } from "@/features/checkout/schemas";
import { getRatesForAddress } from "@/features/shipping/actions";
import { STORE_ORIGIN_LABEL, type ShippingRate } from "@/features/shipping/biteship";
import { useCartStore, useCartSubtotal } from "@/features/cart/store";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

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

  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
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

  const postalCode = watch("postalCode");

  useEffect(() => {
    if (isMounted && items.length === 0) {
      router.replace("/keranjang");
    }
  }, [isMounted, items.length, router]);

  useEffect(() => {
    if (!isMounted || items.length === 0) return;
    const code = (postalCode ?? "").trim();
    if (code.length < 5) {
      setRates([]);
      setSelectedRateId(null);
      setRatesError(null);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      const load = async () => {
        setRatesLoading(true);
        setRatesError(null);
        const result = await getRatesForAddress({
          postalCode: code,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        });
        if (cancelled) return;
        setRatesLoading(false);
        if (!result.success || !result.rates || result.rates.length === 0) {
          setRates([]);
          setSelectedRateId(null);
          setRatesError(result.message ?? "Tarif pengiriman tidak tersedia.");
          return;
        }
        setRates(result.rates);
        setSelectedRateId((prev) =>
          result.rates?.some((r) => r.id === prev) ? prev : (result.rates?.[0]?.id ?? null)
        );
      };
      void load();
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isMounted, postalCode, items]);

  if (!isMounted || items.length === 0) {
    return (
      <main className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <LoadingState message="Memuat halaman checkout..." />
        </div>
      </main>
    );
  }

  const selectedRate = rates.find((r) => r.id === selectedRateId) ?? null;
  const shippingCost = selectedRate?.price ?? 0;
  const grandTotal = subtotal + shippingCost;

  const onSubmit = async (addressValues: AddressInput) => {
    if (!selectedRate) {
      toast.error("Pilih layanan pengiriman terlebih dahulu.");
      return;
    }

    const payload = {
      address: addressValues,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
      shippingCost: selectedRate.price,
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
                  <Truck className="size-4 text-primary" aria-hidden="true" />
                  Metode Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-xs text-muted-foreground">
                  Dikirim dari {STORE_ORIGIN_LABEL}. Masukkan kode pos untuk melihat tarif.
                </p>
                {ratesLoading ? (
                  <LoadingState message="Menghitung ongkos kirim..." className="py-6" />
                ) : rates.length === 0 ? (
                  <div className="flex items-center gap-3 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                    <Package className="size-5 shrink-0" aria-hidden="true" />
                    <span>
                      {ratesError ??
                        "Tarif pengiriman akan muncul setelah kode pos terisi."}
                    </span>
                  </div>
                ) : (
                  <div role="radiogroup" aria-label="Pilihan kurir" className="space-y-2">
                    {rates.map((rate) => {
                      const selected = rate.id === selectedRateId;
                      return (
                        <label
                          key={rate.id}
                          className={cn(
                            "flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-4 transition-colors",
                            selected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/40"
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping-rate"
                              value={rate.id}
                              checked={selected}
                              onChange={() => setSelectedRateId(rate.id)}
                              className="size-4 accent-[#8B5E3C]"
                            />
                            <span>
                              <span className="block text-sm font-semibold">
                                {rate.courier} {rate.service}
                                {rate.isMock ? (
                                  <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                    Mock
                                  </span>
                                ) : null}
                              </span>
                              <span className="block text-xs text-muted-foreground">
                                {rate.description} • {rate.duration}
                              </span>
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {formatIDR(rate.price)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
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
                    <span className="font-semibold text-foreground">
                      {selectedRate ? formatIDR(shippingCost) : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
                    <span>Total Tagihan</span>
                    <span className="text-primary">{formatIDR(grandTotal)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isSubmitting || !selectedRate}
                >
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
