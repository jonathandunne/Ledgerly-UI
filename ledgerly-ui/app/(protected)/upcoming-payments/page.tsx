"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<Record<string, "unpaid" | "pending" | "paid">>({});

  const rippleAddress = "raeKU3M78mvDKsPGWKVs6hbWCsjqPZPtQf";
  const xrpUsdRate = Number(process.env.NEXT_PUBLIC_XRP_USD_RATE ?? "1.43");
  const activePayment = useMemo(
    () => items.find((stream) => stream.stream_id === activePaymentId) ?? null,
    [items, activePaymentId]
  );

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

  const activeAmountUsd = activePayment ? getStreamAmount(activePayment) : 0;
  const activeAmountXrp = useMemo(() => {
    if (!activePayment || !xrpUsdRate || Number.isNaN(xrpUsdRate)) {
      return 0;
    }
    return activeAmountUsd / xrpUsdRate;
  }, [activeAmountUsd, activePayment, xrpUsdRate]);

  const checkPaymentStatus = async (streamId: string, amountXrp: number) => {
    const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000").replace(/\/+$/, "");
    const url = `${baseUrl}/api/xrp/payment-status/?address=${encodeURIComponent(
      rippleAddress
    )}&amount_xrp=${encodeURIComponent(amountXrp.toFixed(6))}`;

    const response = await fetch(url);
    if (!response.ok) {
      return false;
    }
    const payload = await response.json();
    return Boolean(payload?.received);
  };

  useEffect(() => {
    if (!activePayment) {
      return;
    }

    const status = paymentStatus[activePayment.stream_id] ?? "unpaid";
    if (status !== "pending") {
      return;
    }

    let isActive = true;
    const interval = setInterval(async () => {
      if (!isActive) {
        return;
      }
      const received = await checkPaymentStatus(activePayment.stream_id, activeAmountXrp);
      if (received && isActive) {
        setPaymentStatus((prev) => ({
          ...prev,
          [activePayment.stream_id]: "paid",
        }));
      }
    }, 5000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [activePayment, activeAmountXrp, paymentStatus, rippleAddress]);

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
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    {formatDate(stream.predicted_next_date)}
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {getStreamLabel(stream)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(getStreamAmount(stream))}
                  </span>
                  {paymentStatus[stream.stream_id] === "paid" ? (
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                      Paid
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setActivePaymentId(stream.stream_id);
                        setPaymentStatus((prev) => ({
                          ...prev,
                          [stream.stream_id]: "pending",
                        }));
                      }}
                      className="flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 transition hover:bg-sky-100/90 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300"
                    >
                      <img
                        src="/ripple-logo.png"
                        alt="Ripple"
                        className="h-4 w-4"
                      />
                      Pay with Ripple
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {activePayment ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/90 p-6 text-slate-900 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.7)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/80 dark:text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Pay with Ripple
                </p>
                <h3 className="text-xl font-semibold">
                  {getStreamLabel(activePayment)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePaymentId(null)}
                className="rounded-full border border-white/30 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-300"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-200">
              <p>
                Send the exact XRP amount shown below to the address. The payment will
                confirm automatically once received.
              </p>
              <div className="rounded-xl border border-white/30 bg-white/70 p-3 text-sm dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Amount
                </p>
                <p className="text-lg font-semibold">
                  {activeAmountXrp.toFixed(6)} XRP
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatCurrency(activeAmountUsd)}
                </p>
              </div>
              <div className="rounded-xl border border-white/30 bg-white/70 p-3 text-sm dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Destination
                </p>
                <p className="break-all font-semibold">{rippleAddress}</p>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/ripple-qr.png"
                  alt="Ripple payment QR"
                  className="h-40 w-40 rounded-xl border border-white/30 bg-white p-3 dark:border-white/10"
                />
              </div>
            </div>

            <div className="mt-6">
              {paymentStatus[activePayment.stream_id] === "paid" ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                  Transaction confirmed
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-sky-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300">
                  Waiting for payment...
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
