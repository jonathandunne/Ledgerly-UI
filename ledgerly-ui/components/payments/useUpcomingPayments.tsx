"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export type RecurringStreamAmount = {
  amount?: number;
  iso_currency_code?: string | null;
  unofficial_currency_code?: string | null;
};

export type RecurringStream = {
  stream_id: string;
  merchant_name?: string | null;
  description?: string | null;
  predicted_next_date?: string | null;
  average_amount?: RecurringStreamAmount | null;
  newest_transaction_amount?: RecurringStreamAmount | null;
  last_amount?: RecurringStreamAmount | null;
  frequency?: string | null;
  is_active?: boolean;
  status?: string | null;
  personal_finance_category_primary?: string | null;
  personal_finance_category_detailed?: string | null;
};

type UpcomingPaymentsState = {
  items: RecurringStream[];
  totalUpcoming: number;
  error: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const UpcomingPaymentsContext = createContext<UpcomingPaymentsState | null>(null);

function buildApiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  return `${normalized}${path.replace(/^\//, "")}`;
}

export function getStreamAmount(stream: RecurringStream): number {
  const newest = stream.newest_transaction_amount?.amount;
  const last = stream.last_amount?.amount;
  const average = stream.average_amount?.amount;
  if (typeof newest === "number") {
    return newest;
  }
  if (typeof last === "number") {
    return last;
  }
  if (typeof average === "number") {
    return average;
  }
  return 0;
}

export function getStreamLabel(stream: RecurringStream): string {
  return stream.merchant_name || stream.description || "Upcoming payment";
}

function useUpcomingPaymentsData() {
  const [items, setItems] = useState<RecurringStream[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUpcomingPayments = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await supabaseBrowser.auth.getUser();
      const userId = data.user?.id;
      if (!userId) {
        setError("No user session");
        return;
      }

      const response = await fetch(
        buildApiUrl(`api/upcoming-payments/?user_id=${encodeURIComponent(userId)}`)
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to load upcoming payments");
      }

      const payload = await response.json();
      setItems(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load upcoming payments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpcomingPayments();
  }, [fetchUpcomingPayments]);

  const totalUpcoming = useMemo(() => {
    return items.reduce((sum, stream) => sum + getStreamAmount(stream), 0);
  }, [items]);

  return {
    items,
    totalUpcoming,
    error,
    loading,
    refresh: fetchUpcomingPayments,
  };
}

export function UpcomingPaymentsProvider({ children }: { children: ReactNode }) {
  const value = useUpcomingPaymentsData();
  return (
    <UpcomingPaymentsContext.Provider value={value}>
      {children}
    </UpcomingPaymentsContext.Provider>
  );
}

export function useUpcomingPayments() {
  const context = useContext(UpcomingPaymentsContext);
  if (!context) {
    throw new Error("useUpcomingPayments must be used within UpcomingPaymentsProvider");
  }
  return context;
}
