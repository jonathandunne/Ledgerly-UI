"use client";

import { useState, useEffect, Suspense } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

function BudgetForm() {
    const searchParams = useSearchParams();
    const [goalName, setGoalName] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [linkedCategory, setLinkedCategory] = useState("dining");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        const id = searchParams.get("id");
        const amount = searchParams.get("amount");

        const fetchBudget = async () => {
            if (id) {
                setLoading(true);
                const { data, error } = await supabaseBrowser
                    .from("user_goals")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (data) {
                    setGoalName(data.goal_name);
                    setTargetAmount(data.target_amount.toString());
                    setTargetDate(data.target_date);
                    setLinkedCategory(data.linked_category);
                }
                setLoading(false);
            } else if (amount) {
                setTargetAmount(amount);
            }
        };

        fetchBudget();
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { data: { user } } = await supabaseBrowser.auth.getUser();

            if (!user) {
                throw new Error("You must be logged in to save a budget.");
            }

            const id = searchParams.get("id");
            const payload = {
                user_id: user.id,
                goal_name: goalName,
                target_amount: parseFloat(targetAmount),
                target_date: targetDate,
                linked_category: linkedCategory,
            };

            let error;

            if (id) {
                const { error: updateError } = await supabaseBrowser
                    .from("user_goals")
                    .update(payload)
                    .eq("id", id);
                error = updateError;
            } else {
                const { error: insertError } = await supabaseBrowser
                    .from("user_goals")
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            setMessage({ type: "success", text: id ? "Budget updated successfully!" : "Budget saved successfully!" });

            if (!id) {
                setGoalName("");
                setTargetAmount("");
                setTargetDate("");
                setLinkedCategory("dining");
            }
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Failed to save budget." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-3xl border border-white/20 bg-white/70 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Goal Name */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                            Goal Name
                        </label>
                        <input
                            type="text"
                            value={goalName}
                            onChange={(e) => setGoalName(e.target.value)}
                            placeholder='e.g., "Spring Break Trip"'
                            required
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
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
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
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            required
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
                        <select
                            value={linkedCategory}
                            onChange={(e) => setLinkedCategory(e.target.value)}
                            className="w-full rounded-2xl border border-white/20 bg-white/50 px-4 py-3 text-slate-900 shadow-inner outline-none transition focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 dark:border-white/10 dark:bg-black/20 dark:text-white"
                        >
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

                {message && (
                    <div className={`rounded-xl p-4 text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-500 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Budget"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function BudgetPage() {
    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-12">
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                    Budgeting
                </p>
                <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
                    Saving Goals
                </h1>
                <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                    Set limits and track your spending goals here.
                </p>
            </div>

            <Suspense fallback={<div>Loading form...</div>}>
                <BudgetForm />
            </Suspense>
        </div>
    );
}
