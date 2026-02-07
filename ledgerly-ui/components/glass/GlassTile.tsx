import Link from "next/link";
import type { ReactNode } from "react";

type GlassTileProps = {
  title: string;
  description?: string;
  metric?: string;
  icon?: ReactNode;
  children?: ReactNode;
  href?: string;
  className?: string;
};

export function GlassTile({
  title,
  description,
  metric,
  icon,
  children,
  href,
  className = "",
}: GlassTileProps) {
  const content = (
    <div
      className={`glass-tile group relative h-full overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-sky-200/30 via-white/10 to-white/5 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-2xl transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_80px_-35px_rgba(56,189,248,0.6)] dark:border-white/10 dark:bg-black/40 dark:from-white/10 dark:via-white/5 dark:to-black/60 dark:shadow-[0_30px_90px_-50px_rgba(0,0,0,0.9)] ${className}`}
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-300/30 blur-2xl dark:bg-sky-300/15" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" />
      </div>
      <div className="relative flex h-full flex-col gap-4">
        {icon ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/40 text-sky-700 shadow-inner dark:bg-white/10 dark:text-sky-200">
            {icon}
          </div>
        ) : null}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          {description ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {description}
            </p>
          ) : null}
        </div>
        {children ? <div className="mt-auto">{children}</div> : null}
        {metric ? (
          <div className="mt-auto text-2xl font-semibold text-slate-900 dark:text-white">
            {metric}
          </div>
        ) : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
