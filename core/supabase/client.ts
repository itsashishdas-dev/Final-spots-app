
import { createClient } from '@supabase/supabase-js';

// Access the shimmed process.env from index.html or fallback to provided credentials
// We avoid import.meta.env because it causes runtime errors in this specific no-build environment
const env = (typeof process !== 'undefined' && process.env) ? process.env : (window as any).process?.env || {};

const PROJECT_URL = env.VITE_SUPABASE_URL || 'https://ahowpzkwhqqfzrszbawr.supabase.co';
const PUBLIC_KEY = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Lbu4Mq4SOk6hUHFjpgjQmw_1MH4wEXP';

if (!PROJECT_URL || !PUBLIC_KEY) {
  console.warn('[Supabase] Missing environment variables. Sync will fail.');
}

export const supabase = createClient(PROJECT_URL, PUBLIC_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: { 'x-application-name': 'spots-client' },
  },
});
