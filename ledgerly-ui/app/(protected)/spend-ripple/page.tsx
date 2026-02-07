export default function SpendRipplePage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-12">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Spend Ripple
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Convert Ripple XRP to cash
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Choose an amount, review the rate, and send to your cash account.
        </p>
      </div>

      <section className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
        <form className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Ripple XRP amount
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/80 px-4 py-3 text-slate-800 shadow-inner dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-transparent text-lg font-semibold outline-none"
              />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-300">
                XRP
              </span>
            </div>

            <label className="block text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Cash destination
            </label>
            <select className="w-full rounded-2xl border border-white/30 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-inner outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200/60 dark:border-white/10 dark:bg-white/10 dark:text-slate-100">
              <option>Ledgerly Cash</option>
              <option>External checking</option>
              <option>Save as pending</option>
            </select>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-white/30 bg-white/60 p-5 text-sm text-slate-600 shadow-inner dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
            <div className="flex items-center justify-between">
              <span>Estimated rate</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                1 XRP = $1.43
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Network fee</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                $1.20
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Estimated cash out</span>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                $0.00
              </span>
            </div>
            <button
              type="button"
              className="mt-auto w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-500"
            >
              Convert to cash
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
