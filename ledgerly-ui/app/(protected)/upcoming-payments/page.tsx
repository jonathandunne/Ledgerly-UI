"use client";

import { useMemo } from "react";
import {
  getStreamAmount,
  getStreamLabel,
  useUpcomingPayments,
} from "@/components/payments/useUpcomingPayments";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) {
    return "--";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UpcomingPaymentsPage() {
  const { items, totalUpcoming, loading, error } = useUpcomingPayments();

  const nextPayment = useMemo(() => {
    const withDate = items.filter((stream) => stream.predicted_next_date);
    if (withDate.length === 0) {
      return null;
    }
    return [...withDate].sort((a, b) => {
      const aDate = new Date(a.predicted_next_date as string).getTime();
      const bDate = new Date(b.predicted_next_date as string).getTime();
      return aDate - bDate;
    })[0];
  }, [items]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-12">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Upcoming payments
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Scheduled outflows
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          {error
            ? "Unable to load upcoming payments."
            : "Stay ahead of the next bills from your linked accounts."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 text-sm text-slate-700 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Total upcoming
          </p>
          <p className="text-2xl font-semibold">
            {loading ? "--" : formatCurrency(totalUpcoming)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 text-sm text-slate-700 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Next payment
          </p>
          <p className="text-2xl font-semibold">
            {loading ? "--" : formatDate(nextPayment?.predicted_next_date)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/20 bg-white/60 p-4 text-sm text-slate-700 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Payments
          </p>
          <p className="text-2xl font-semibold">
            {loading ? "--" : items.length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/20 bg-white/60 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Payment schedule
          </h2>
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {items.length} items
          </span>
        </div>
        <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200">
          {items.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">
              No upcoming payments found.
            </p>
          ) : (
            items.map((stream) => (
              <div
                key={stream.stream_id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/40 px-3 py-2 dark:border-white/5 dark:bg-white/5"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {formatDate(stream.predicted_next_date)}
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
