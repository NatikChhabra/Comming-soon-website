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
      const { error } = await supabase
        .from('waitlist_signups')
        .insert([{ email: normalizedEmail }])

      // Ignore duplicate key error (23505) as success
      if (error && error.code !== '23505') {
        console.error('Supabase error:', error)
        return {
          success: false,
          error: error.message || 'Something went wrong. Please try again.',
        }
      }

      const updatedCount = await getWaitlistCount()
      return { success: true, count: updatedCount ?? undefined }
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
