import { GlassGrid } from "@/components/glass/GlassGrid";
import { GlassTile } from "@/components/glass/GlassTile";

const tiles = [
  {
    title: "Credit Score",
    description: "Track score movement and impacts.",
    href: "/credit-score",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 7v5l3 3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Upcoming Payments",
    description: "Stay ahead of due dates.",
    href: "/upcoming-payments",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M7 4v4M17 4v4M4 9h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="4"
          y="9"
          width="16"
          height="11"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    title: "Spending",
    description: "Insights into your cash flow.",
    href: "/spending",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M4 7h16M7 12h10M9 17h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Spend Ripple",
    description: "Convert XRP to cash seamlessly.",
    href: "/spend-ripple",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Subscriptions",
    description: "Monitor recurring commitments.",
    href: "/subscriptions",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M5 6h14M6 10h12M7 14h10M8 18h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Net Worth",
    description: "Balance assets and liabilities.",
    href: "/net-worth",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
        <path
          d="M12 3v18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M7 8l5-5 5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 16l5 5 5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function ProtectedHomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-12">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Welcome back
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Choose your financial lens
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Every view is protected and ready for Plaid-powered insights.
        </p>
      </div>
      <GlassGrid>
        {tiles.map((tile) => (
          <GlassTile key={tile.title} {...tile} />
        ))}
      </GlassGrid>
    </div>
  );
}
