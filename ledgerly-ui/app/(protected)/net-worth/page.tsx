"use client";

import { useMemo } from "react";
import { useNetWorth } from "@/components/networth/NetWorthProvider";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function NetWorthPage() {
  const {
    totalAssets,
    totalDebts,
    netWorth,
    assets,
    debts,
    error,
    loading,
  } = useNetWorth();

  const summaryMessage = useMemo(() => {
    if (error) {
      return "Unable to load balances";
    }
    if (loading || totalAssets === null || totalDebts === null || netWorth === null) {
      return "Loading balances...";
    }
    return "Updated from your Plaid-linked accounts.";
  }, [loading, error, totalAssets, totalDebts, netWorth]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-12">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Net worth
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Assets minus debts
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          {summaryMessage}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 text-sm text-slate-700 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Assets
          </p>
          <p className="text-2xl font-semibold">
            {totalAssets === null ? "--" : formatCurrency(totalAssets)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 text-sm text-slate-700 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Debts
          </p>
          <p className="text-2xl font-semibold">
            {totalDebts === null ? "--" : formatCurrency(totalDebts)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 text-sm text-slate-700 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Net worth
          </p>
          <p className="text-2xl font-semibold">
            {netWorth === null ? "--" : formatCurrency(netWorth)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <details className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40" open>
          <summary className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-white">
            Assets ({assets.length})
          </summary>
          <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {assets.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">No asset accounts.</p>
            ) : (
              assets.map((row) => (
                <div
                  key={`${row.institution}-${row.account}`}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/40 px-3 py-2 dark:border-white/5 dark:bg-white/5"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {row.institution}
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {row.account}
                    </p>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(row.value)}
                  </span>
                </div>
              ))
            )}
          </div>
        </details>

        <details className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40" open>
          <summary className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-white">
            Debts ({debts.length})
          </summary>
          <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {debts.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">No debt accounts.</p>
            ) : (
              debts.map((row) => (
                <div
                  key={`${row.institution}-${row.account}`}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/40 px-3 py-2 dark:border-white/5 dark:bg-white/5"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {row.institution}
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {row.account}
                    </p>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(row.value)}
                  </span>
                </div>
              ))
            )}
          </div>
        </details>
      </div>
    </div>
  );
}
