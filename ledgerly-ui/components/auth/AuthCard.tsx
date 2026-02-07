import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/20 bg-gradient-to-br from-sky-200/30 via-white/10 to-white/5 p-8 shadow-[0_35px_90px_-50px_rgba(15,23,42,0.6)] backdrop-blur-2xl dark:border-white/10 dark:from-sky-400/10 dark:via-slate-900/30 dark:to-slate-950/40">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
          Ledgerly
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>
      </div>
      <div className="mt-8 space-y-5">{children}</div>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </div>
  );
}
