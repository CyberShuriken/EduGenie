export const appUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 
   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
   "http://localhost:3000");

export function getSupabaseEnv() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co").trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                 "placeholder-anon-key").trim();
  
  return {
    url,
    anonKey,
    configured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    ),
  };
}
