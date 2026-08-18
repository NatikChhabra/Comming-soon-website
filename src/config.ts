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
    url: (import.meta.env.sb_publishable_2u2HCFUsscF0AR-t5kyVQA_llV7Tsrr as string) || '',
    anonKey: (import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjenVnc3h3YXByanBkemN1aGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNjYxNjEsImV4cCI6MjEwMjY0MjE2MX0.sxKA4hrX8sGvVUnvzctfAFpolhN_CctsWCtmHdcZC1M as string) || '',
  },
}
