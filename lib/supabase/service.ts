import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

// Server-only service-role client. NEVER import this in client components.
// Bypasses RLS — use only in webhooks, cron jobs, and admin routes.
export function createServiceClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
