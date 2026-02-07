
import { createClient } from '@supabase/supabase-js';

// Connection credentials for the PUSH Supabase instance
// Safely access env to prevent "undefined is not an object" error
const env = (import.meta as any).env || {};

// Use provided credentials as fallback if env vars are missing
const PROJECT_URL = env.VITE_SUPABASE_URL || 'https://ahowpzkwhqqfzrszbawr.supabase.co';
const ANON_KEY = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Lbu4Mq4SOk6hUHFjpgjQmw_1MH4wEXP';

if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase env vars missing. Using hardcoded fallback credentials for dev/demo.');
}

// Initialize the client for public read access
export const supabase = createClient(PROJECT_URL, ANON_KEY);
