"use client";

import { useState, useMemo } from "react";
import { useSpending } from "@/components/spending/SpendingProvider";
import { TRANSACTION_CATEGORIES } from "@/constants/categories";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function SpendingPage() {
  const {
    transactions,
    selectedCategories,
    loading,
    error,
    refresh,
  } = useSpending();



  const summaryMessage = useMemo(() => {
    if (error) return "Unable to load transactions";
    if (loading) return "Loading transactions...";
    return `${transactions.length} recurring transaction${transactions.length !== 1 ? "s" : ""} detected from your linked accounts.`;
  }, [loading, error, transactions.length]);

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-12">
        <div className="text-center text-slate-600 dark:text-slate-300">
          Loading transactions...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-12 px-4">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Spending
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Transaction History
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          {summaryMessage}
        </p>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={refresh}
          disabled={loading}
          className="rounded-xl border border-white/20 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white/90 disabled:opacity-50 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-50/50 p-4 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Transactions List */}
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-white/20 bg-white/60 p-8 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40">
            <p className="text-slate-500 dark:text-slate-400">
              No transactions found. Link a bank account to see your spending.
            </p>
          </div>
        ) : (
          transactions.map((tx) => {
            const categoryId = selectedCategories[tx.stream_id] ?? 50;
            const category = TRANSACTION_CATEGORIES.find((c) => c.id === categoryId);
            const isOutflow = tx.last_amount.amount > 0;

            return (
              <div
                key={tx.stream_id}
                className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/60 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40"
              >
                {/* Amount - Left */}
                <div className="w-32 flex-shrink-0">
                  <p
                    className={`text-lg font-semibold ${
                      isOutflow
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {isOutflow ? "-" : "+"}
                    {formatCurrency(tx.last_amount.amount)}
                  </p>
                </div>

                {/* Transaction Name - Middle */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate dark:text-white">
                    {tx.merchant_name || tx.description}
                  </p>
                </div>

                {/* Date & Category - Right */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {tx.last_date}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {tx.frequency}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 dark:bg-white/10">
                    <span className="text-lg">{category?.icon}</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-100">
                      {category?.name ?? "Other"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}