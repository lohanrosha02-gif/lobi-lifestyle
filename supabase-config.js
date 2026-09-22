/* LOBI LIFESTYLE - conexão pública com Supabase */
const SUPABASE_URL = "https://hipjermrntnmjzpmfrcu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_UUVEeIVWqYVFqbl9ToYZ_A_CVuYcIg6";

window.lobiSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
