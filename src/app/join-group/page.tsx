import { InterestForm } from '@/components/InterestForm'
import { getMentorOptions } from '@/lib/mentors.server'

export const metadata = {
  title: 'Join Community | Workplace Network',
}

interface JoinGroupPageProps {
  // Next.js 15: searchParams is async — must be awaited
  searchParams: Promise<{ group?: string }>
}

export default async function JoinGroupPage({ searchParams }: JoinGroupPageProps) {
  const { group } = await searchParams
  const mentors = await getMentorOptions()

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <InterestForm initialYearsOfExperience={group} mentors={mentors} />
    </main>
  )
}