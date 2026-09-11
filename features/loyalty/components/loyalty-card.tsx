"use client";

import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LoyaltyData } from "@/features/loyalty/services";

const tierConfig = {
  Bronze: { color: "bg-amber-600", icon: "🥉", benefits: "Dapatkan 1 poin per Rp 1.000" },
  Silver: { color: "bg-slate-400", icon: "🥈", benefits: "Dapatkan 1.1 poin per Rp 1.000 + diskon 5%" },
  Gold: { color: "bg-yellow-500", icon: "🥇", benefits: "Dapatkan 1.2 poin per Rp 1.000 + diskon 10%" },
  Platinum: { color: "bg-purple-600", icon: "💎", benefits: "Dapatkan 1.5 poin per Rp 1.000 + diskon 15%" },
};

type LoyaltyCardProps = {
  loyalty: LoyaltyData | null;
};

export function LoyaltyCard({ loyalty }: LoyaltyCardProps) {
  if (!loyalty) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="size-5 text-primary" />
            Program Loyalitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Mulai berbelanja untuk mengumpulkan poin dan naik tier.
          </p>
        </CardContent>
      </Card>
    );
  }

  const config = tierConfig[loyalty.tier];
  const pointsToNextTier =
    loyalty.tier === "Bronze"
      ? 500 - loyalty.lifetime_points
      : loyalty.tier === "Silver"
        ? 2000 - loyalty.lifetime_points
        : loyalty.tier === "Gold"
          ? 5000 - loyalty.lifetime_points
          : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-5 text-primary" />
              Program Loyalitas
            </CardTitle>
            <CardDescription>Kumpulkan poin dan naik tier</CardDescription>
          </div>
          <Badge className={`${config.color} text-white`}>
            {config.icon} {loyalty.tier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Poin Tersedia</p>
            <p className="text-2xl font-bold text-primary">{loyalty.points}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Poin</p>
            <p className="text-2xl font-bold">{loyalty.lifetime_points}</p>
          </div>
          {pointsToNextTier > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Ke Tier Berikutnya</p>
              <p className="text-2xl font-bold text-amber-600">{pointsToNextTier}</p>
            </div>
          )}
        </div>

        <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-3">
          <p className="text-xs font-semibold text-foreground">Keuntungan {loyalty.tier}:</p>
          <p className="text-xs text-muted-foreground">{config.benefits}</p>
        </div>
      </CardContent>
    </Card>
  );
}
