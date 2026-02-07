import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GlassBackground } from "@/components/layout/GlassBackground";
import { ProfileMenu } from "@/components/nav/ProfileMenu";
import { NetWorthProvider } from "@/components/networth/NetWorthProvider";
import { SpendingProvider } from "@/components/spending/SpendingProvider";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <GlassBackground>
      <NetWorthProvider>
        <SpendingProvider>
          <div className="flex min-h-screen flex-col">
            <header className="flex items-center justify-between px-6 py-6 md:px-12">
              <a href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-800 shadow-inner dark:text-sky-100">
                  <span className="text-sm font-semibold">L</span>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                    Ledgerly
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Liquid glass finance
                  </p>
                </div>
              </a>
              <ProfileMenu email={data.user.email} />
            </header>
            <main className="flex-1 px-6 pb-16 md:px-12">{children}</main>
          </div>
        </SpendingProvider>
      </NetWorthProvider>
    </GlassBackground>
  );
}
