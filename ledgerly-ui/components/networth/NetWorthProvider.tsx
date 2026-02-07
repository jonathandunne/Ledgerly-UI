"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

type PlaidAccount = {
  balances: {
    available: number | null;
    current: number | null;
    limit: number | null;
    iso_currency_code: string | null;
    unofficial_currency_code: string | null;
  };
  type: string;
};

type NetWorthState = {
  totalAssets: number | null;
  totalDebts: number | null;
  netWorth: number | null;
  error: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const NetWorthContext = createContext<NetWorthState | null>(null);

function buildApiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  return `${normalized}${path.replace(/^\//, "")}`;
}

export function NetWorthProvider({ children }: { children: ReactNode }) {
  const [totalAssets, setTotalAssets] = useState<number | null>(null);
  const [totalDebts, setTotalDebts] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const netWorth = useMemo(() => {
    if (totalAssets === null || totalDebts === null) {
      return null;
    }
    return totalAssets - totalDebts;
  }, [totalAssets, totalDebts]);

  const fetchNetWorth = async () => {
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
        buildApiUrl(`api/get-account-balance/?user_id=${encodeURIComponent(userId)}`)
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to load balances");
      }

      const payload = await response.json();
      const accounts = (payload.accounts ?? []) as PlaidAccount[];

      const assets = accounts.reduce((sum, account) => {
        if (account.type === "credit" || account.type === "loan") {
          return sum;
        }
        const current = account.balances?.current;
        const available = account.balances?.available;
        const balance = typeof current === "number" ? current : available ?? 0;
        return sum + balance;
      }, 0);

      const debts = accounts.reduce((sum, account) => {
        if (account.type !== "credit" && account.type !== "loan") {
          return sum;
        }
        const current = account.balances?.current;
        const available = account.balances?.available;
        const balance = typeof current === "number" ? current : available ?? 0;
        return sum + balance;
      }, 0);

      setTotalAssets(assets);
      setTotalDebts(debts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load balances");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const init = async () => {
      const { data } = await supabaseBrowser.auth.getUser();
      const userId = data.user?.id;
      if (userId) {
        await fetchNetWorth();
        return;
      }

      const { data: listener } = supabaseBrowser.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user?.id) {
            fetchNetWorth();
          }
        }
      );

      return () => {
        listener.subscription.unsubscribe();
      };
    };

    const cleanupPromise = init();

    return () => {
      isActive = false;
      cleanupPromise.then((cleanup) => {
        if (!isActive && cleanup) {
          cleanup();
        }
      });
    };
  }, []);

  const value = useMemo(
    () => ({
      totalAssets,
      totalDebts,
      netWorth,
      error,
      loading,
      refresh: fetchNetWorth,
    }),
    [totalAssets, totalDebts, netWorth, error, loading]
  );

  return (
    <NetWorthContext.Provider value={value}>
      {children}
    </NetWorthContext.Provider>
  );
}

export function useNetWorth() {
  const context = useContext(NetWorthContext);
  if (!context) {
    throw new Error("useNetWorth must be used within NetWorthProvider");
  }
  return context;
}
