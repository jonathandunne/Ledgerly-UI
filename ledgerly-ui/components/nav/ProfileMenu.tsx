"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

type ProfileMenuProps = {
  email?: string | null;
};

export function ProfileMenu({ email }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

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
          <div className="mt-2 border-t border-white/30 pt-3 dark:border-white/10">
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
