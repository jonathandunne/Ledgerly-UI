import { GlassGrid } from "@/components/glass/GlassGrid";
import { GlassTile } from "@/components/glass/GlassTile";

const tiles = [
  {
    title: "Credit Score",
    description: "Score signals and impacts.",
    href: "/credit-score",
    metric: "--",
  },
  {
    title: "Total Assets",
    description: "Holdings across accounts.",
    href: "/total-assets",
    metric: "--",
  },
  {
    title: "Upcoming Payments",
    description: "Bills and transfers on deck.",
    href: "/upcoming-payments",
    metric: "--",
  },
  {
    title: "Spending",
    description: "Daily cash flow trends.",
    href: "/spending",
    metric: "--",
  },
  {
    title: "Subscriptions",
    description: "Recurring expenses monitor.",
    href: "/subscriptions",
    metric: "--",
  },
  {
    title: "Net Worth",
    description: "Assets minus liabilities.",
    href: "/net-worth",
    metric: "--",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 py-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Data will appear here after Plaid connection is added.
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
