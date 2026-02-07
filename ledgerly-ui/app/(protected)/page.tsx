"use client";

import { useMemo } from "react";
import { GlassGrid } from "@/components/glass/GlassGrid";
import { GlassTile } from "@/components/glass/GlassTile";
import { useNetWorth } from "@/components/networth/NetWorthProvider";

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
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M4 7h16M7 12h10M9 17h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Spend Ripple",
    description: "Convert XRP to cash seamlessly.",
    href: "/spend-ripple",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Subscriptions",
    description: "Monitor recurring commitments.",
    href: "/subscriptions",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M5 6h14M6 10h12M7 14h10M8 18h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function ProtectedHomePage() {
  const { totalAssets, totalDebts, netWorth, error, loading } = useNetWorth();

  const netWorthStatus = useMemo(() => {
    if (loading) {
      return "--";
    }
    if (netWorth === null) {
      return "--";
    }
    return formatCurrency(netWorth);
  }, [loading, netWorth]);

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
        {tiles.map((tile) => (
          <GlassTile key={tile.title} {...tile} />
        ))}
      </GlassGrid>
    </div>
  );
}
