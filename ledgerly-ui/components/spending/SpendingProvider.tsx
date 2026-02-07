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

type Transaction = {
  stream_id: string;
  description: string;
  merchant_name: string | null;
  first_date: string;
  last_date: string;
  frequency: string;
  last_amount: {
    amount: number;
    iso_currency_code: string | null;
  };
  personal_finance_category: {
    primary: string;
    detailed: string;
  };
};

type TransactionResponse = {
  inflow_streams: Transaction[];
  outflow_streams: Transaction[];
};

type SpendingState = {
  transactions: Transaction[];
  selectedCategories: Record<string, number>;
  loading: boolean;
  error: string | null;
  updateTransactionCategory: (transactionId: string, categoryId: number) => void;
  refresh: () => Promise<void>;
};

const SpendingContext = createContext<SpendingState | null>(null);

function buildApiUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  return `${normalized}${path.replace(/^\//, "")}`;
}

// Map Plaid's API categories to our local category IDs
function mapApiCategoryToLocal(apiCategory: string): number {
  const categoryMap: Record<string, number> = {
    'INCOME_SALARY': 35,
    'INCOME_FREELANCE': 36,
    'INCOME_INVESTMENT': 37,
    'TRANSFER_OUT_ACCOUNT_TRANSFER': 33,
    'TRANSFER_IN_ACCOUNT_TRANSFER': 33,
    'GENERAL_MERCHANDISE_SPORTING_GOODS': 40,
    'GENERAL_MERCHANDISE_SUPERSTORES': 9,
    'GENERAL_MERCHANDISE_BOOKSTORES': 38,
    'GENERAL_MERCHANDISE_CLOTHING': 20,
    'GENERAL_MERCHANDISE_ELECTRONICS': 21,
    'FOOD_AND_DRINK_RESTAURANT': 1,
    'FOOD_AND_DRINK_GROCERIES': 0,
    'FOOD_AND_DRINK_COFFEE': 18,
    'FOOD_AND_DRINK_FAST_FOOD': 19,
    'FOOD_AND_DRINK_BAR': 41,
    'TRAVEL_FLIGHTS': 13,
    'TRAVEL_LODGING': 14,
    'TRAVEL_TAXI': 46,
    'TRAVEL_PUBLIC_TRANSIT': 45,
    'TRAVEL_PARKING': 43,
    'TRAVEL_TOLLS': 44,
    'TRANSPORTATION_GAS': 3,
    'TRANSPORTATION_PUBLIC_TRANSIT': 45,
    'TRANSPORTATION_TAXI': 46,
    'PERSONAL_CARE_GYMS_AND_FITNESS_CENTERS': 8,
    'PERSONAL_CARE_HAIR': 15,
    'PERSONAL_CARE_SPA': 15,
    'LOAN_PAYMENTS_CREDIT_CARD_PAYMENT': 30,
    'LOAN_PAYMENTS_PERSONAL_LOAN_PAYMENT': 29,
    'LOAN_PAYMENTS_MORTGAGE_PAYMENT': 5,
    'RENT_AND_UTILITIES_RENT': 5,
    'RENT_AND_UTILITIES_GAS_AND_ELECTRICITY': 4,
    'RENT_AND_UTILITIES_INTERNET_AND_CABLE': 16,
    'RENT_AND_UTILITIES_TELEPHONE': 16,
    'ENTERTAINMENT_CASINOS_AND_GAMBLING': 10,
    'ENTERTAINMENT_MUSIC_AND_AUDIO': 10,
    'ENTERTAINMENT_SPORTING_EVENTS': 40,
    'ENTERTAINMENT_TV_AND_MOVIES': 17,
    'MEDICAL_PRIMARY_CARE': 7,
    'MEDICAL_DENTIST': 7,
    'MEDICAL_PHARMACY': 7,
    'BANK_FEES_ATM': 32,
    'BANK_FEES_OVERDRAFT': 31,
    'BANK_FEES_OTHER': 31,
  };
  
  return categoryMap[apiCategory] ?? 50; // Default to "Other"
}

export function SpendingProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
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
        buildApiUrl(`api/get-transactions/?user_id=${encodeURIComponent(userId)}`)
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to load transactions");
      }

      const payload: TransactionResponse = await response.json();
      
      const allTransactions = [
        ...(payload.inflow_streams ?? []),
        ...(payload.outflow_streams ?? [])
      ];

      setTransactions(allTransactions);

      // Initialize categories based on API data
      const categoriesMap: Record<string, number> = {};
      allTransactions.forEach((tx) => {
        const apiCategory = tx.personal_finance_category?.detailed ?? "";
        categoriesMap[tx.stream_id] = mapApiCategoryToLocal(apiCategory);
      });
      setSelectedCategories(categoriesMap);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionCategory = (transactionId: string, categoryId: number) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [transactionId]: categoryId,
    }));
    
    // TODO: Persist to backend/database if needed
    // await fetch('/api/update-category', { ... })
  };

  useEffect(() => {
    let isActive = true;
    
    const init = async () => {
      const { data } = await supabaseBrowser.auth.getUser();
      const userId = data.user?.id;

      if (userId) {
        await fetchTransactions();
        return;
      }

      const { data: listener } = supabaseBrowser.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user?.id) {
            fetchTransactions();
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
      transactions,
      selectedCategories,
      loading,
      error,
      updateTransactionCategory,
      refresh: fetchTransactions,
    }),
    [transactions, selectedCategories, loading, error]
  );

  return (
    <SpendingContext.Provider value={value}>
      {children}
    </SpendingContext.Provider>
  );
}

export function useSpending() {
  const context = useContext(SpendingContext);
  if (!context) {
    throw new Error("useSpending must be used within SpendingProvider");
  }
  return context;
}