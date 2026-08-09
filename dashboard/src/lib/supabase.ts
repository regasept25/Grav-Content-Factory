import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.warn('NEXT_PUBLIC_SUPABASE_URL is missing. API routes will fail until env vars are set in Vercel.');
}

if (!supabaseKey) {
  console.warn('SUPABASE key is missing. API routes will fail until env vars are set in Vercel.');
}

export const supabase = createClient(supabaseUrl ?? 'http://localhost', supabaseKey ?? 'public-anon-key');
