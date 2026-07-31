import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Instagram, Linkedin, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const revalidate = 300

interface Props {
  params: { slug: string }
}

interface Mentor {
  id?: string
  name: string
  photo_url?: string | null
  title?: string | null
  tagline?: string | null
  group_url?: string | null
  linkedin_url?: string | null
  instagram_url?: string | null
  bio?: string | null
}

// "james-mohammed" → "james mohammed" then match case-insensitively in DB
function slugToName(slug: string): string {
  return slug.replace(/-/g, ' ')
}

async function getMentor(slug: string): Promise<Mentor | null> {
  const nameApprox = slugToName(slug) // e.g. "james mohammed"
  const { data } = await supabase
    .from('mentors')
    .select('*')
    .ilike('name', nameApprox) // case-insensitive match
    .single()
  return data
}

export default async function MentorProfilePage({ params }: Props) {
  const mentor = await getMentor(params.slug)

  if (!mentor) notFound()

  return (
    <>
      <Navbar />
      <main className=" bg-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 pt-6 sm:pt-8">

{/* ── Hero banner + overlapping avatar ── */}
<div className="relative">
  <div
    className="w-full h-40 sm:h-52 rounded-2xl overflow-hidden relative isolate"
    style={{
      background: 'linear-gradient(135deg, #27272d 0%, #0f0f17 50%, #080808 100%)',
    }}
  >
    {/* Drifting aurora orbs — subtle motion, no distraction */}
    <div className="banner-orb banner-orb-gold" aria-hidden="true" />
    <div className="banner-orb banner-orb-blue" aria-hidden="true" />

    {/* Fine dot grid, faded toward the edges for texture */}
    <div
      className="absolute inset-0 opacity-[0.15]"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
        maskImage: 'radial-gradient(ellipse at 30% 30%, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 30% 30%, black 0%, transparent 70%)',
      }}
    />

    {/* Back arrow — mobile only */}
    <Link
      href="/#mentors"
      className="md:hidden absolute top-4 left-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors text-white backdrop-blur-sm"
      aria-label="Back to mentors"
    >
      <ArrowLeft size={18} />
    </Link>
  </div>

  {/* Avatar block stays exactly as-is below this */}

            {/* Avatar — overlaps the bottom-left corner of the banner */}
            <div className="absolute left-0 -bottom-10 sm:-bottom-14 md:-bottom-16">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                {mentor.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mentor.photo_url}
                    alt={mentor.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <span className="text-3xl md:text-4xl font-bold text-gray-500">
                      {mentor.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Name / meta + bio, sharing one consistent top offset ── */}
          <div className="pt-14 sm:pt-16 md:pt-24 md:grid md:grid-cols-[280px_1fr] md:gap-12 md:items-start">

            {/* Left column */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{mentor.name}</h1>
              {mentor.title && (
                <p className="text-sm text-gray-500-500 mt-1 font-medium">{mentor.title}</p>
              )}
              {mentor.tagline && (
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                  {mentor.tagline}
                </p>
              )}
              {/* {mentor.group_url && (
                <Link
                  href={mentor.group_url}
                  className="inline-block mt-3 text-sm text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Join group
                </Link>
              )} */}
              <SocialLinks mentor={mentor} className="mt-5" />
            </div>

            {/* Right column — bio (desktop only) */}
            <div className="hidden md:block">
              <BioParagraphs bio={mentor.bio} />
            </div>
          </div>

          {/* Bio — mobile only, stacked below */}
          <div className="md:hidden mt-6 pb-12">
            <BioParagraphs bio={mentor.bio} />
          </div>

        </div>

        <div className="hidden md:block pb-16" />
      </main>
      <Footer />
    </>
  )
}

function SocialLinks({
  mentor,
  className = '',
}: {
  mentor: Mentor
  className?: string
}) {
  const linkedin = mentor.linkedin_url ?? undefined
  const instagram = mentor.instagram_url ?? undefined

  if (!linkedin && !instagram) return null

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-500 font-medium mr-1">Connect</span>
      <div className="flex-1 h-px bg-gray-200" />
      <div className="flex gap-2 ml-2">
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-8 h-8 rounded-md flex items-center justify-center bg-[#0A66C2] text-white hover:opacity-90 transition-opacity"
          >
            <Linkedin size={15} />
          </a>
        )}
        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-8 h-8 rounded-md flex items-center justify-center text-white hover:opacity-90 transition-opacity"
            style={{
              background:
                'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
            }}
          >
            <Instagram size={15} />
          </a>
        )}
      </div>
    </div>
  )
}

function BioParagraphs({ bio }: { bio?: string | null }) {
  if (!bio) return null

  const paragraphs = bio
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => (
        <p key={i} className="text-gray-700 text-sm sm:text-base leading-relaxed">
          {para}
        </p>
      ))}
    </div>
  )
}