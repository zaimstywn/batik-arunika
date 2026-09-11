"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/features/newsletter/services";
import { toast } from "sonner";

export function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email wajib diisi");
      return;
    }

    setIsLoading(true);
    const result = await subscribeToNewsletter(email);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
      setEmail("");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email Anda"
            className="pr-10"
            disabled={isLoading}
          />
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Mendaftar..." : "Daftar"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Dapatkan tips, promo, dan koleksi terbaru langsung di inbox Anda.
      </p>
    </form>
  );
}
