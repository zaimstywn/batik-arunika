"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/common/empty-state";
import type { LoyaltyHistoryEntry } from "@/features/loyalty/services";

type LoyaltyHistoryProps = {
  history: LoyaltyHistoryEntry[];
};

export function LoyaltyHistory({ history }: LoyaltyHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Poin</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <EmptyState
            title="Belum ada riwayat"
            message="Riwayat poin loyalitas Anda akan tampil di sini."
          />
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {entry.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold ${
                    entry.points > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {entry.points > 0 ? "+" : ""}{entry.points}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
