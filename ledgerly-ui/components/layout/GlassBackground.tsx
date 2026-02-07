import type { ReactNode } from "react";

type GlassBackgroundProps = {
  children: ReactNode;
  className?: string;
};

export function GlassBackground({ children, className = "" }: GlassBackgroundProps) {
  return (
    <div className={`relative min-h-screen ${className}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-400/10" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-400/10" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl dark:bg-cyan-300/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-sky-50/50 to-white/20 dark:from-black/95 dark:via-black/80 dark:to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)] opacity-0 dark:opacity-100" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
