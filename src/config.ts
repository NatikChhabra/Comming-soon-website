/**
 * Application Configuration
 *
 * To connect Supabase for waitlist signups:
 * 1. Create a free project at https://supabase.com
 * 2. Go to Project Settings -> API
 * 3. Copy the Project URL and Anon / Public Key
 * 4. Paste them into .env or directly in the fallback strings below
 */

export const config = {
  supabase: {
    url: (import.meta.env.VITE_SUPABASE_URL as string) || '',
    anonKey: (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '',
  },
}
