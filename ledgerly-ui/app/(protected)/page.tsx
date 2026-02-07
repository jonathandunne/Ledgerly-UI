"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { GlassGrid } from "@/components/glass/GlassGrid";
import { GlassTile } from "@/components/glass/GlassTile";
import { useNetWorth } from "@/components/networth/NetWorthProvider";
import { useSpending } from "@/components/spending/SpendingProvider";
import { TRANSACTION_CATEGORIES } from "@/constants/categories";

interface Budget {
  id: string;
  goal_name: string;
  target_amount: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

const tiles = [
  {
    title: "Credit Score",
    description: "Track score movement and impacts.",
    href: "/credit-score",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 7v5l3 3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Upcoming Payments",
    description: "Stay ahead of due dates.",
    href: "/upcoming-payments",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M7 4v4M17 4v4M4 9h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="4"
          y="9"
          width="16"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    title: "Spending",
    description: "Insights into your cash flow.",
    href: "/spending",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    custom: true,
  },

  {
    title: "Subscriptions",
    description: "Monitor recurring commitments.",
    href: "/subscriptions",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path d="M21 10c0-1.1-.9-2-2-2h-6l-2-3-2 3H5a2 2 0 000 4h14a2 2 0 002-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function ProtectedHomePage() {
  const { totalAssets, totalDebts, netWorth, error, loading } = useNetWorth();
  const { transactions, selectedCategories } = useSpending();
  const [budgetInput, setBudgetInput] = useState("");
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      if (user) {
        const { data } = await supabaseBrowser
          .from("user_budgets")
          .select("id, goal_name, target_amount")
          .eq("user_id", user.id);
        if (data) setBudgets(data);
      }
    };
    fetchBudgets();
  }, []);

  const netWorthStatus = useMemo(() => {
    if (loading) {
      return "--";
    }
    if (netWorth === null) {
      return "--";
    }
    return formatCurrency(netWorth);
  }, [loading, netWorth]);

  const latestTransaction = useMemo(() => {
    if (transactions.length === 0) return null;
    // Find the most recent transaction
    const sorted = [...transactions].sort((a, b) => {
      return new Date(b.last_date).getTime() - new Date(a.last_date).getTime();
    });
    return sorted[0];
  }, [transactions]);

  const topCategoryLast7Days = useMemo(() => {
    if (transactions.length === 0) return null;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const spendingByCategory: Record<number, number> = {};

    transactions.forEach((tx) => {
      const txDate = new Date(tx.last_date);
      if (txDate >= sevenDaysAgo && tx.last_amount.amount > 0) {
        const categoryId = selectedCategories[tx.stream_id] ?? 50;
        spendingByCategory[categoryId] =
          (spendingByCategory[categoryId] ?? 0) + tx.last_amount.amount;
      }
    });

    // If no transactions in past 7 days, use the latest transaction's category
    let topCategoryId: number;
    let amount: number;

    if (Object.keys(spendingByCategory).length === 0 && latestTransaction) {
      topCategoryId = selectedCategories[latestTransaction.stream_id] ?? 50;
      amount = latestTransaction.last_amount.amount;
    } else if (Object.keys(spendingByCategory).length === 0) {
      return null;
    } else {
      const entry = Object.entries(spendingByCategory).reduce((a, b) =>
        b[1] > a[1] ? b : a
      );
      topCategoryId = parseInt(entry[0]);
      amount = entry[1];
    }

    const topCategory = TRANSACTION_CATEGORIES.find(
      (c) => c.id === topCategoryId
    );

    return {
      category: topCategory,
      amount: amount,
    };
  }, [transactions, selectedCategories, latestTransaction]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-12">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Welcome back
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Choose your financial lens
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Every view is protected and ready for Plaid-powered insights.
        </p>
      </div>
      <GlassGrid>
        <GlassTile
          title="Net worth"
          description="Assets minus debts from Plaid."
          href="/net-worth"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path d="M12 1v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M17 5H9a4 4 0 100 8h6a4 4 0 010 8H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        >
          {error ? (
            <p className="text-sm text-rose-500">Unable to load balances</p>
          ) : (
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Assets
                </span>
                <span className="font-semibold">
                  {totalAssets === null ? "--" : formatCurrency(totalAssets)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Debts
                </span>
                <span className="font-semibold">
                  {totalDebts === null ? "--" : formatCurrency(totalDebts)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-white/20 pt-2 text-base font-semibold text-slate-900 dark:border-white/10 dark:text-white">
                <span>Net</span>
                <span>{netWorthStatus}</span>
              </div>
            </div>
          )}

        </GlassTile>
        <GlassTile
          title="Saving Goals"
          description="Manage your saving targets."
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          }
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mt-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  USD
                </span>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/50 py-2 pl-10 pr-3 text-sm text-slate-900 shadow-inner outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
                  placeholder="0.00"
                />
              </div>
              <Link
                href={`/budget${budgetInput ? `?amount=${budgetInput}` : ""}`}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/90 text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-500 hover:scale-105 active:scale-95 dark:bg-sky-500/80 dark:hover:bg-sky-400"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            {/* Existing Budgets */}
            {budgets.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {budgets.map((budget) => (
                  <Link
                    key={budget.id}
                    href={`/budget?id=${budget.id}`}
                    className="flex flex-col rounded-lg border border-white/10 bg-white/20 p-2 text-xs transition hover:bg-white/30 hover:scale-105 active:scale-95 dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <span className="font-medium text-slate-900 dark:text-white truncate">
                      {budget.goal_name}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatCurrency(budget.target_amount)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </GlassTile>
        <GlassTile
          title="Spending"
          description="Insights into your cash flow."
          href="/spending"
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              <path d="M3 12h3l3-8 4 16 3-8h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        >
          <div className="space-y-3 text-sm">
            {topCategoryLast7Days && (
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Top spending (7 days)
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {topCategoryLast7Days.category?.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {topCategoryLast7Days.category?.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {formatCurrency(topCategoryLast7Days.amount)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {latestTransaction && (
              <div className="space-y-1 border-t border-white/20 pt-2 dark:border-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Latest transaction
                </p>
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {latestTransaction.merchant_name ||
                    latestTransaction.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>{latestTransaction.last_date}</span>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    -{formatCurrency(latestTransaction.last_amount.amount)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </GlassTile>
        {tiles.map((tile) => (
          !tile.custom && <GlassTile key={tile.title} {...tile} />
        ))}
      </GlassGrid>
    </div >
  );
}
