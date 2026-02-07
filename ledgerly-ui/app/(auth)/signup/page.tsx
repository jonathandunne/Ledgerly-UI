"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signUpError } = await supabaseBrowser.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start with secure, liquid glass finance workflows."
      footer={
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-sky-700 hover:text-sky-600 dark:text-sky-200"
          >
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-white/30 bg-white/60 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200/60 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:focus:ring-sky-500/30"
            placeholder="you@ledgerly.ai"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-white/30 bg-white/60 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200/60 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:focus:ring-sky-500/30"
            placeholder="Create a strong password"
          />
        </div>
        {error ? (
          <p className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-600 dark:text-red-300">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </AuthCard>
  );
}
