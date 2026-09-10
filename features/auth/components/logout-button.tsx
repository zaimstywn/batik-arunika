"use client";

import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  const onClick = async () => {
    setPending(true);
    try {
      await logoutAction();
    } catch {
      toast.error("Gagal keluar. Silakan coba lagi.");
      setPending(false);
    }
  };

  return (
    <Button variant="outline" onClick={onClick} disabled={pending}>
      {pending ? (
        <Loader2 className="animate-spin" aria-hidden="true" />
      ) : (
        <LogOut aria-hidden="true" />
      )}
      {pending ? "Memproses..." : "Keluar"}
    </Button>
  );
}
