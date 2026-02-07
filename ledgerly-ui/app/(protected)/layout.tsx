import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GlassBackground } from "@/components/layout/GlassBackground";
import { ProfileMenu } from "@/components/nav/ProfileMenu";
import { NetWorthProvider } from "@/components/networth/NetWorthProvider";
import { UpcomingPaymentsProvider } from "@/components/payments/useUpcomingPayments";
import { SubscriptionsProvider } from "@/components/subscriptions/useSubscriptions";
import { SpendingProvider } from "@/components/spending/SpendingProvider";
import { CreditScoreProvider } from "@/components/credit/CreditScoreProvider";

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
        <CreditScoreProvider>
          <UpcomingPaymentsProvider>
            <SubscriptionsProvider>
              <SpendingProvider>
                <div className="flex min-h-screen flex-col">
                  <header className="flex items-center justify-between px-6 py-6 md:px-12">
                    <Link href="/" className="flex items-center gap-3">
                      <Image src="/ledgerly-logo.jpeg" alt="Ledgerly Logo" width={40} height={40} className="h-10 w-10 rounded-2xl object-cover shadow-inner" />
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                          Ledgerly
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Liquid glass finance
                        </p>
                      </div>
                    </Link>
                    <ProfileMenu email={data.user.email} />
                  </header>
                  <main className="flex-1 px-6 pb-16 md:px-12">{children}</main>
                </div>
              </SpendingProvider>
            </SubscriptionsProvider>
          </UpcomingPaymentsProvider>
        </CreditScoreProvider>
      </NetWorthProvider>
    </GlassBackground>
  );
}
