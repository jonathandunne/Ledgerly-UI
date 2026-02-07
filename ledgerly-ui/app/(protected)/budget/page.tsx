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
                <form className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Goal Name */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                Goal Name
                            </label>
                            <input
                                type="text"
                                placeholder='e.g., "Spring Break Trip"'
                                className="w-full rounded-2xl border border-white/20 bg-white/50 px-4 py-3 text-slate-900 shadow-inner outline-none transition focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
                            />
                            <p className="text-xs text-slate-500">
                                Giving your goal a name helps the AI understand its purpose.
                            </p>
                        </div>

                        {/* Target Amount */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                Target Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500 dark:text-slate-400">
                                    $
                                </span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full rounded-2xl border border-white/20 bg-white/50 py-3 pl-8 pr-4 text-slate-900 shadow-inner outline-none transition focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
                                />
                            </div>
                            <p className="text-xs text-slate-500">
                                The AI uses this to calculate required savings velocity.
                            </p>
                        </div>

                        {/* Target Date */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                Target Date
                            </label>
                            <input
                                type="date"
                                className="w-full rounded-2xl border border-white/20 bg-white/50 px-4 py-3 text-slate-900 shadow-inner outline-none transition focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 dark:border-white/10 dark:bg-black/20 dark:text-white dark:[color-scheme:dark]"
                            />
                            <p className="text-xs text-slate-500">
                                A deadline is essential for creating a realistic plan.
                            </p>
                        </div>

                        {/* Linked Category */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                Linked Category
                            </label>
                            <select className="w-full rounded-2xl border border-white/20 bg-white/50 px-4 py-3 text-slate-900 shadow-inner outline-none transition focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 dark:border-white/10 dark:bg-black/20 dark:text-white">
                                <option value="dining">Dining Out</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="shopping">Shopping</option>
                                <option value="transport">Transport</option>
                            </select>
                            <p className="text-xs text-slate-500">
                                The AI will suggest trade-offs from this category first.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
