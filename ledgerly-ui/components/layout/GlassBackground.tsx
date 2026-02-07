import type { ReactNode } from "react";

type GlassBackgroundProps = {
  children: ReactNode;
  className?: string;
};

export function GlassBackground({ children, className = "" }: GlassBackgroundProps) {
  return (
    <div className={`relative min-h-screen ${className}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/20" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-500/10" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-500/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-sky-50/50 to-white/20 dark:from-slate-950/80 dark:via-slate-900/70 dark:to-slate-950/90" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
