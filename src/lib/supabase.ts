import { createClient } from '@supabase/supabase-js'
import { config } from '../config'

const supabaseUrl = config.supabase.url
const supabaseAnonKey = config.supabase.anonKey

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseUrl.startsWith('https://'),
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Fetch total count of waitlist subscribers
 */
export async function getWaitlistCount(): Promise<number | null> {
  if (supabase) {
    try {
      // Try calling the secure count function first
      const { data: count, error: rpcError } = await supabase.rpc('get_waitlist_count')
      if (!rpcError && typeof count === 'number') {
        return count
      }

      // Fallback: direct select count if permitted
      const { count: exactCount, error } = await supabase
        .from('waitlist_signups')
        .select('*', { count: 'exact', head: true })

      if (!error && typeof exactCount === 'number') {
        return exactCount
      }
    } catch (err) {
      console.warn('Failed to fetch waitlist count:', err)
    }
  }

  // Fallback: check local storage count if available
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('numen_waitlist_emails')
      if (stored) {
        const list = JSON.parse(stored)
        if (Array.isArray(list)) return list.length
      }
    } catch {}
  }

  return null
}

/**
 * Submit an email to the waitlist
 */
export async function submitWaitlistEmail(
  email: string,
): Promise<{ success: boolean; error?: string; count?: number }> {
  const normalizedEmail = email.trim().toLowerCase()

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { success: false, error: 'Enter a valid email address.' }
  }

  if (supabase) {
    try {
      // Preferred path: a SECURITY DEFINER function, so the table needs no anon
      // INSERT grant at all. See db/waitlist-policy.sql.
      const { error: rpcError } = await supabase.rpc('join_waitlist', {
        p_email: normalizedEmail,
        p_referrer:
          typeof document !== 'undefined' ? document.referrer || null : null,
      })

      if (!rpcError) {
        const updatedCount = await getWaitlistCount()
        return { success: true, count: updatedCount ?? undefined }
      }

      // Fall back to a direct insert while that function is not deployed yet.
      const { error } = await supabase
        .from('waitlist_signups')
        .insert([{ email: normalizedEmail }])

      // A duplicate (23505) means they are already on the list. That is success.
      if (!error || error.code === '23505') {
        const updatedCount = await getWaitlistCount()
        return { success: true, count: updatedCount ?? undefined }
      }

      // Never show a visitor a raw Postgres error. Before this, a blocked insert
      // put "new row violates row-level security policy for table
      // waitlist_signups" on screen under the signup button.
      console.error('Waitlist insert failed:', error)
      return {
        success: false,
        error:
          'Could not save your email. Try again, or write to natik.chhabra@numen.site.',
      }
    } catch (err) {
      console.error('Waitlist submission failed:', err)
      return { success: false, error: 'Network error — check your connection.' }
    }
  }

  // If Supabase is not configured yet, save to localStorage and return success
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('numen_waitlist_emails') || '[]'
      const list = JSON.parse(stored)
      if (!list.includes(normalizedEmail)) {
        list.push(normalizedEmail)
        localStorage.setItem('numen_waitlist_emails', JSON.stringify(list))
      }
      return { success: true, count: list.length }
    } catch {
      return { success: true }
    }
  }

  return { success: true }
}
