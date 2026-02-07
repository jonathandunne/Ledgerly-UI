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
import {
  getStreamAmount,
  type RecurringStream,
} from "@/components/payments/useUpcomingPayments";

function buildApiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  return `${normalized}${path.replace(/^\//, "")}`;
}

const MONTHLY_MULTIPLIER: Record<string, number> = {
  DAILY: 30.437,
  WEEKLY: 4.345,
  BIWEEKLY: 2.172,
  SEMIMONTHLY: 2,
  MONTHLY: 1,
  QUARTERLY: 1 / 3,
  ANNUALLY: 1 / 12,
};

function toMonthlyAmount(stream: RecurringStream) {
  const amount = getStreamAmount(stream);
  const freq = (stream.frequency ?? "").toUpperCase();
  const multiplier = MONTHLY_MULTIPLIER[freq] ?? 1;
  return amount * multiplier;
}

type SubscriptionsState = {
  items: RecurringStream[];
  monthlyTotal: number;
  error: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const SubscriptionsContext = createContext<SubscriptionsState | null>(null);

function useSubscriptionsData() {
  const [items, setItems] = useState<RecurringStream[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = useCallback(async () => {
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
        buildApiUrl(`api/subscriptions/?user_id=${encodeURIComponent(userId)}`)
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to load subscriptions");
      }

      const payload = await response.json();
      setItems(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const monthlyTotal = useMemo(() => {
    return items.reduce((sum, stream) => sum + toMonthlyAmount(stream), 0);
  }, [items]);

  return {
    items,
    monthlyTotal,
    error,
    loading,
    refresh: fetchSubscriptions,
  };
}

export function SubscriptionsProvider({ children }: { children: ReactNode }) {
  const value = useSubscriptionsData();
  return (
    <SubscriptionsContext.Provider value={value}>
      {children}
    </SubscriptionsContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionsContext);
  if (!context) {
    throw new Error("useSubscriptions must be used within SubscriptionsProvider");
  }
  return context;
}
