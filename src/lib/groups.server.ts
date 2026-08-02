import 'server-only'
import { createAdminClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

export type ExperienceGroup = Pick<
  Database['public']['Tables']['experience_groups']['Row'],
  'slug' | 'name' | 'description'
>

const FALLBACK_GROUPS: ExperienceGroup[] = [
  {
    slug: 'under-5',
    name: 'Associate',
    description:
      'For early-career professionals building their foundation, finding their footing, and figuring out where their career is headed.',
  },
  {
    slug: '5-9',
    name: 'Professionals',
    description:
      'For professionals growing into leadership, sharpening their craft, and taking on bigger responsibility.',
  },
  {
    slug: '10-plus',
    name: 'Experts',
    description:
      'For seasoned leaders and mentors ready to share hard-won wisdom and shape the next generation.',
  },
]

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')
  )
}

/**
 * Display-safe group data for the homepage CommunityGroups cards.
 */
export async function getPublicExperienceGroups(): Promise<ExperienceGroup[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_GROUPS
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('experience_groups')
    .select('slug, name, description')
    .order('sort_order')

  if (error || !data?.length) {
    return FALLBACK_GROUPS
  }

  return data
}