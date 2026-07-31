import 'server-only'
import { createAdminClient } from '@/lib/supabase'
import { FALLBACK_MENTORS } from '@/lib/fallback-data'

export interface MentorOption {
  id: string
  name: string
  title: string | null
}

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')
  )
}

/**
 * Live mentor list for the Preferred Mentor dropdown. Reads name/title
 * directly from the mentors table, so renaming a mentor there updates
 * the form on the next page load — no code change needed.
 */
export async function getMentorOptions(): Promise<MentorOption[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_MENTORS.map(({ id, name, title }) => ({ id, name, title }))
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase.from('mentors').select('id, name, title').order('name')
  if (error || !data?.length) {
    if (error) console.error('mentors query failed:', error.message, error.code, error.details)
    else console.warn('mentors query returned 0 rows')
    return FALLBACK_MENTORS.map(({ id, name, title }) => ({ id, name, title }))
  }

  return data
}