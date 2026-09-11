"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WhatsAppSupport() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890";
  const message = encodeURIComponent(
    "Halo! Saya ingin bertanya tentang produk Batik Arunika."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      <Button
        size="icon"
        className="fixed bottom-6 right-6 z-40 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Chat dengan kami di WhatsApp"
      >
        <MessageCircle className="size-5" />
      </Button>
    </Link>
  );
}
