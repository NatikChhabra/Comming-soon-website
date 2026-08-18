/**
 * Application Configuration
 *
 * Supabase configuration for Numen waitlist signups
 */

export const config = {
  supabase: {
    url:
      (import.meta.env.VITE_SUPABASE_URL as string) ||
      'https://pczugsxwaprjpdzcuhkn.supabase.co',
    anonKey:
      (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjenVnc3h3YXByanBkemN1aGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNjYxNjEsImV4cCI6MjEwMjY0MjE2MX0.sxKA4hrX8sGvVUnvzctfAFpolhN_CctsWCtmHdcZC1M',
  },
}
