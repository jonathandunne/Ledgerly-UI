import type { ReactNode } from "react";

type GlassGridProps = {
  children: ReactNode;
  className?: string;
};

export function GlassGrid({ children, className = "" }: GlassGridProps) {
  return (
    <div
      className={`grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch ${className}`}
    >
      {children}
    </div>
  );
}
