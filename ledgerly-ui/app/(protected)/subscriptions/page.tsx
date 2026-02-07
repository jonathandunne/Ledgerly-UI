"use client";

import {
  getStreamAmount,
  getStreamLabel,
} from "@/components/payments/useUpcomingPayments";
import { useSubscriptions } from "@/components/subscriptions/useSubscriptions";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function SubscriptionsPage() {
  const { items, monthlyTotal, loading, error } = useSubscriptions();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-12">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Subscriptions
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Monthly recurring bills
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          {error
            ? "Unable to load subscriptions."
            : "Track your recurring subscriptions and monthly totals."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 text-sm text-slate-700 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Monthly total
          </p>
          <p className="text-2xl font-semibold">
            {loading ? "--" : formatCurrency(monthlyTotal)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 text-sm text-slate-700 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Active subscriptions
          </p>
          <p className="text-2xl font-semibold">
            {loading ? "--" : items.length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 text-sm text-slate-700 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Top subscription
          </p>
          <p className="text-2xl font-semibold">
            {loading || items.length === 0 ? "--" : getStreamLabel(items[0])}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Subscription list
          </h2>
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {items.length} items
          </span>
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
          {items.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">
              No subscriptions found.
            </p>
          ) : (
            items.map((stream) => (
              <div
                key={stream.stream_id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/40 px-3 py-2 dark:border-white/5 dark:bg-white/5"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {stream.frequency ?? "Recurring"}
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {getStreamLabel(stream)}
                  </p>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(getStreamAmount(stream))}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
