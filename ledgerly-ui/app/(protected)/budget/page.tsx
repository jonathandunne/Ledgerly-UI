export default function BudgetPage() {
    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-12">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                    Budgeting
                </p>
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
                    Your Monthly Budget
                </h1>
                <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                    Set limits and track your spending goals here.
                </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
                <p className="text-slate-600 dark:text-slate-300">
                    Budget features comming soon...
                </p>
            </div>
        </div>
    );
}
