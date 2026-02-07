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

type CreditScoreState = {
  score: number | null;
  rating: string | null;
  error: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const CreditScoreContext = createContext<CreditScoreState | null>(null);

function buildApiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  return `${normalized}${path.replace(/^\//, "")}`;
}

function getRating(score: number) {
  if (score < 580) {
    return "Bad";
  }
  if (score < 670) {
    return "Fair";
  }
  if (score < 740) {
    return "Good";
  }
  return "Excellent";
}

export function CreditScoreProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState<number | null>(null);
  const [rating, setRating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCreditScore = async () => {
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
        buildApiUrl(`api/credit-score/?user_id=${encodeURIComponent(userId)}`)
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to load credit score");
      }

      const payload = await response.json();
      const nextScore = typeof payload.credit_score === "number" ? payload.credit_score : null;

      setScore(nextScore);
      setRating(nextScore === null ? null : getRating(nextScore));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load credit score");
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
        await fetchCreditScore();
        return;
      }

      const { data: listener } = supabaseBrowser.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user?.id) {
            fetchCreditScore();
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
      score,
      rating,
      error,
      loading,
      refresh: fetchCreditScore,
    }),
    [score, rating, error, loading]
  );

  return (
    <CreditScoreContext.Provider value={value}>
      {children}
    </CreditScoreContext.Provider>
  );
}

export function useCreditScore() {
  const context = useContext(CreditScoreContext);
  if (!context) {
    throw new Error("useCreditScore must be used within CreditScoreProvider");
  }
  return context;
}
