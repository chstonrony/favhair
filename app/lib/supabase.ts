import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./supabase-config";

export type PhotoRow = {
  id: string;
  title: string | null;
  subtitle: string | null;
  storage_path: string;
  sort_order: number | null;
  created_at: string | null;
};

let clientPromise: Promise<SupabaseClient> | null = null;

/**
 * 브라우저 전용 Supabase 클라이언트(지연 생성 싱글턴).
 * 서버 렌더링/프리렌더 중에는 절대 생성하지 않습니다.
 */
export function getSupabase(): Promise<SupabaseClient> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Supabase 클라이언트는 브라우저에서만 사용할 수 있습니다."));
  }
  if (!isSupabaseConfigured()) {
    return Promise.reject(new Error("Supabase 설정이 아직 준비되지 않았습니다."));
  }
  if (!clientPromise) {
    clientPromise = import("@supabase/supabase-js").then(({ createClient }) =>
      createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      }),
    );
    clientPromise.catch(() => {
      clientPromise = null;
    });
  }
  return clientPromise;
}
