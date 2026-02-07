"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { usePlaidLink } from "react-plaid-link";

type ProfileMenuProps = {
  email?: string | null;
};

type ConnectedInstitution = {
  institution_name: string;
  institution_id: string;
  is_connected: boolean;
};

export function ProfileMenu({ email }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const [institutions, setInstitutions] = useState<ConnectedInstitution[]>([]);
  const [plaidConnected, setPlaidConnected] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [plaidOpen, setPlaidOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000/";

  // Fetch current user and link token from backend when component mounts or email changes
  useEffect(() => {
    const fetchUserAndToken = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabaseBrowser.auth.getUser();
        if (user) {
          setUserId(user.id);
        }

        // Fetch link token
        if (!user?.id) {
          console.error("No user found; cannot create link token");
          return;
        }

        // Fetch connected institutions
        const instResponse = await fetch(`${apiBase}api/connected-institutions/?user_id=${user.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (instResponse.ok) {
          const instData = await instResponse.json();
          setInstitutions(instData);
          if (instData.length > 0) {
            setPlaidConnected(true);
          }
        }

        const response = await fetch(`${apiBase}api/create-link-token/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });
        if (!response.ok) {
          const text = await response.text();
          console.error("create-link-token returned non-OK response:", response.status, text);
          return;
        }
        const data = await response.json();
        console.log("create-link-token response:", data);
        setLinkToken(data.link_token ?? null);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserAndToken();
  }, [email]);

  // Plaid Link hook
  const { open: openPlaid, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        // Send public_token to your backend to exchange for access_token
        if (!userId) {
          console.error("No user found; cannot exchange token");
          return;
        }
        const response = await fetch(`${apiBase}api/exchange-public-token/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            public_token,
            institution_id: metadata.institution?.institution_id,
          }),
        });
        if (!response.ok) {
          const text = await response.text();
          console.error("exchange-token returned non-OK response:", response.status, text);
          return;
        }
        const data = await response.json();
        console.log("exchange-token response:", data);
        // Store access token in Supabase
        if (userId && data.access_token && data.item_id) {
          const { error: insertError } = await supabaseBrowser
            .from("user_plaid_items")
            .insert([
              {
                user_id: userId,
                access_token: data.access_token,
                item_id: data.item_id,
              },
            ]);

          if (insertError) {
            console.error("Error storing Plaid token in Supabase:", insertError);
            return;
          }

          console.log("Plaid token successfully stored in Supabase");
        }
        console.log("Plaid connected successfully!", data);
        setPlaidConnected(true);
        setPlaidOpen(false);

        // Optimistically update the list of connected institutions
        const newInst: ConnectedInstitution = {
          institution_name: metadata.institution?.name ?? "Unknown Bank",
          institution_id: metadata.institution?.institution_id ?? "unknown",
          is_connected: true,
        };
        setInstitutions((prev) => [...prev, newInst]);
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
            {institutions.length > 0 ? (
              <div className="space-y-2">
                {institutions.map((inst) => (
                  <div
                    key={inst.institution_id}
                    className="rounded-xl border border-green-500/30 bg-green-50/50 px-3 py-2 dark:bg-green-500/10"
                  >
                    <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                      ✓ {inst.institution_name} {inst.is_connected ? "Connected" : ""}
                    </p>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleConnectPlaid}
                  disabled={!ready}
                  className="w-full mt-2 rounded-xl border border-sky-500/30 bg-sky-50/70 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100/90 disabled:opacity-50 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20"
                >
                  + Connect Another Bank
                </button>
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
