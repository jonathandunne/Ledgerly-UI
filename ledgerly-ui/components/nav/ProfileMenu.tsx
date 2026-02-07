"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { usePlaidLink } from "react-plaid-link";

type ProfileMenuProps = {
  email?: string | null;
};

export function ProfileMenu({ email }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const [plaidConnected, setPlaidConnected] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [plaidOpen, setPlaidOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Fetch link token from your backend when component mounts
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await fetch("/api/plaid/create-link-token");
        if (!response.ok) {
          const text = await response.text();
          console.error("create-link-token returned non-OK response:", response.status, text);
          return;
        }
        const data = await response.json();
        console.log("create-link-token response:", data);
        setLinkToken(data.link_token ?? null);
      } catch (error) {
        console.error("Error fetching link token:", error);
      }
    };
    fetchLinkToken();
  }, []);

  // Plaid Link hook
  const { open: openPlaid, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        // Send public_token to your backend to exchange for access_token
        const response = await fetch("/api/plaid/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token }),
        });
        if (!response.ok) {
          const text = await response.text();
          console.error("exchange-token returned non-OK response:", response.status, text);
          return;
        }
        const data = await response.json();
        console.log("Plaid connected successfully!", data);
        setPlaidConnected(true);
        setPlaidOpen(false);
      } catch (error) {
        console.error("Error exchanging token:", error);
      }
    },
    onExit: (error, metadata) => {
      if (error) {
        console.error("Plaid exited with error:", error);
      }
      setPlaidOpen(false);
    },
  });

  // Debug: log when linkToken or ready changes
  useEffect(() => {
    console.log("Plaid linkToken:", linkToken, "ready:", ready);
  }, [linkToken, ready]);

  useEffect(() => {
    document.documentElement.classList.toggle("plaid-open", plaidOpen);
    return () => {
      document.documentElement.classList.remove("plaid-open");
    };
  }, [plaidOpen]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!menuRef.current) {
        return;
      }
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleConnectPlaid = () => {
    console.log("handleConnectPlaid called; ready=", ready, "linkToken=", linkToken);
    if (!linkToken) {
      console.error("No link token available; cannot open Plaid Link");
      return;
    }
    if (ready) {
      setPlaidOpen(true);
      openPlaid(); // Opens Plaid Link modal
    } else {
      console.log("Plaid Link not ready yet...");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full border border-white/20 bg-white/40 px-3 py-1 text-sm font-medium text-slate-800 backdrop-blur-lg transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
      >
        <span className="hidden text-xs text-slate-500 dark:text-slate-300 sm:inline">
          {email ?? "Signed in"}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-200/60 text-sm font-semibold text-sky-900 dark:bg-sky-500/20 dark:text-sky-100">
          {(email ?? "U").slice(0, 1).toUpperCase()}
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 z-20 mt-3 w-64 rounded-2xl border border-white/20 bg-white/60 p-4 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.7)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60">
          {/* Bank Account Section */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Bank Account
            </p>
            {plaidConnected ? (
              <div className="rounded-xl border border-green-500/30 bg-green-50/50 px-3 py-2 dark:bg-green-500/10">
                <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                  ✓ Bank Connected
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConnectPlaid}
                disabled={!ready}
                className="w-full rounded-xl border border-sky-500/30 bg-sky-50/70 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100/90 disabled:opacity-50 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20"
              >
                + Connect Bank Account
              </button>
            )}
          </div>

          {/* Logout Section */}
          <div className="mt-3 border-t border-white/30 pt-3 dark:border-white/10">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-xl border border-white/20 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white/90 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
