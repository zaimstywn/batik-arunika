"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export type LoyaltyData = {
  points: number;
  lifetime_points: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  updated_at: string;
};

export type LoyaltyHistoryEntry = {
  id: string;
  user_id: string;
  order_id: string | null;
  points: number;
  description: string;
  created_at: string;
};

export async function getCustomerLoyalty(
  userId: string
): Promise<LoyaltyData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_loyalty")
    .select("points, lifetime_points, tier, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch loyalty data:", error.message);
    return null;
  }

  return data as LoyaltyData | null;
}

export async function getLoyaltyHistory(
  userId: string,
  limit: number = 10
): Promise<LoyaltyHistoryEntry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("loyalty_history")
    .select("id, user_id, order_id, points, description, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch loyalty history:", error.message);
    return [];
  }

  return (data ?? []) as LoyaltyHistoryEntry[];
}

function calculateTier(totalPoints: number): "Bronze" | "Silver" | "Gold" | "Platinum" {
  if (totalPoints >= 5000) return "Platinum";
  if (totalPoints >= 2000) return "Gold";
  if (totalPoints >= 500) return "Silver";
  return "Bronze";
}

export async function awardOrderPoints(
  orderId: string,
  userId: string,
  orderTotal: number
): Promise<{ success: boolean; pointsAwarded: number; error?: string }> {
  const serviceClient = await createServiceClient();

  // Calculate points: 1 point per Rp 1,000 spent
  const pointsAwarded = Math.floor(orderTotal / 1000);

  if (pointsAwarded <= 0) {
    return { success: true, pointsAwarded: 0 };
  }

  try {
    // Check if user loyalty record exists
    const { data: existing } = await serviceClient
      .from("user_loyalty")
      .select("points, lifetime_points")
      .eq("user_id", userId)
      .maybeSingle();

    if (!existing) {
      // Create new loyalty record
      await serviceClient.from("user_loyalty").insert({
        user_id: userId,
        points: pointsAwarded,
        lifetime_points: pointsAwarded,
        tier: calculateTier(pointsAwarded),
        updated_at: new Date().toISOString(),
      });
    } else {
      // Update existing record
      const newLifetimePoints = existing.lifetime_points + pointsAwarded;
      const newTier = calculateTier(newLifetimePoints);

      await serviceClient
        .from("user_loyalty")
        .update({
          points: existing.points + pointsAwarded,
          lifetime_points: newLifetimePoints,
          tier: newTier,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    }

    // Record history entry
    await serviceClient.from("loyalty_history").insert({
      user_id: userId,
      order_id: orderId,
      points: pointsAwarded,
      description: `Earned ${pointsAwarded} points from order #${orderId.slice(0, 8)}`,
    });

    return { success: true, pointsAwarded };
  } catch (error) {
    console.error("Failed to award points:", error);
    return {
      success: false,
      pointsAwarded: 0,
      error: "Gagal menambah poin loyalitas",
    };
  }
}

export async function spendLoyaltyPoints(
  userId: string,
  pointsToSpend: number,
  description: string
): Promise<{ success: boolean; error?: string }> {
  const serviceClient = await createServiceClient();

  try {
    const { data: loyalty } = await serviceClient
      .from("user_loyalty")
      .select("points")
      .eq("user_id", userId)
      .maybeSingle();

    if (!loyalty || loyalty.points < pointsToSpend) {
      return { success: false, error: "Poin tidak cukup" };
    }

    await serviceClient
      .from("user_loyalty")
      .update({
        points: loyalty.points - pointsToSpend,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    await serviceClient.from("loyalty_history").insert({
      user_id: userId,
      points: -pointsToSpend,
      description,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to spend points:", error);
    return { success: false, error: "Gagal menggunakan poin" };
  }
}
