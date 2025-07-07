import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/database.types";

export interface DriverEarningsSummary {
  total: number;
  thisMonth: number;
  thisWeek: number;
  earnings: Database["public"]["Tables"]["driver_earnings"]["Row"][];
}

export function useDriverEarnings(driverId: string) {
  const [summary, setSummary] = useState<DriverEarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!driverId) {
      return;
    }
    fetchEarnings();
    // eslint-disable-next-line
  }, [driverId]);

  const fetchEarnings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("driver_earnings")
        .select("*")
        .eq("driver_id", driverId)
        .order("created_at", { ascending: false });
      if (error) {
        throw error;
      }
      const earnings: Database["public"]["Tables"]["driver_earnings"]["Row"][] =
        data || [];
      // Calculate totals
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      let total = 0,
        thisMonth = 0,
        thisWeek = 0;
      for (const e of earnings) {
        const dt = new Date(e.created_at);
        if (dt >= startOfMonth) {
          thisMonth += e.amount;
        }
        total += e.amount;
        if (dt >= startOfWeek) {
          thisWeek += e.amount;
        }
      }
      setSummary({ total, thisMonth, thisWeek, earnings });
    } catch (err: any) {
      setError(err.message || "Failed to load earnings");
    } finally {
      setLoading(false);
    }
  };

  // Request payout for all eligible earnings
  const requestPayout = async () => {
    try {
      const { error } = await supabase
        .from("driver_earnings")
        .update({ payout_requested: true })
        .eq("driver_id", driverId)
        .eq("payout_requested", false);
      if (error) {
        throw error;
      }
      await fetchEarnings();
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to request payout");
      return false;
    }
  };

  return { summary, loading, error, refetch: fetchEarnings, requestPayout };
}

// For admin approval: add a mutation to set payout_approved=true.
