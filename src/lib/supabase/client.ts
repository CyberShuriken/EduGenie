"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";

export function createClient() {
  const { url, anonKey, configured } = getSupabaseEnv();
  
  if (!configured) {
    console.error("Supabase environment variables are not configured correctly.");
  }
  
  return createBrowserClient(url, anonKey);
}
