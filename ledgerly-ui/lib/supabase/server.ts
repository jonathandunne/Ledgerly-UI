import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function mustGetEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = mustGetEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = mustGetEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(
        name: string,
        value: string,
        options: Record<string, unknown>
      ) {
        try {
          cookieStore.set({ name, value, ...(options as any) });
        } catch {
          // Ignore attempts to set cookies in server components.
        }
      },
      remove(name: string, options: Record<string, unknown>) {
        try {
          cookieStore.set({ name, value: "", ...(options as any) });
        } catch {
          // Ignore attempts to remove cookies in server components.
        }
      },
    },
  });
}
