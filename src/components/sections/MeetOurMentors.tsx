'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Mentor } from '@/types/database'

const AVATAR_COLORS = ['#4A5568', '#2D3748', '#718096', '#A0AEC0']

// Converts "James Mohammed" → "james-mohammed"
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // strip special chars
    .replace(/\s+/g, '-')          // spaces → hyphens
}

interface MentorCardProps {
  mentor: Mentor
  index: number
}

function MentorCard({ mentor, index }: MentorCardProps) {
  const slug = nameToSlug(mentor.name)
  const imgRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  // Catches images already resolved (cache) before onLoad could attach.
  useEffect(() => {
    setLoaded(false)
    setErrored(false)
    const img = imgRef.current
    if (img?.complete) {
      if (img.naturalWidth === 0) {
        setErrored(true)
      } else {
        setLoaded(true)
      }
    }
  }, [mentor.photo_url])

  const showPhoto = Boolean(mentor.photo_url) && !errored

  return (
    <div className="relative rounded-2xl overflow-hidden group aspect-[3/4] w-full">
      {/* Photo / Placeholder */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: showPhoto
            ? undefined
            : AVATAR_COLORS[index % AVATAR_COLORS.length],
        }}
      >
        {showPhoto ? (
          <>
            <div
              className={`absolute inset-0 skeleton-shimmer transition-opacity duration-300 ${
                loaded ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={mentor.photo_url ?? undefined}
              alt={mentor.name}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setErrored(true)}
              className={`w-full h-full object-cover object-top transition-opacity duration-500 ease-out ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            />
          </div>
        )}
      </div>

      {/* Gradient overlay — bottom only */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.80) 100%)',
        }}
      />

      {/* Name + title + arrow — all at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
        <div>
          <p className="text-white font-semibold text-sm leading-tight">
            {mentor.name}
          </p>
          {mentor.title && (
            <p className="text-white/70 text-xs mt-0.5">{mentor.title}</p>
          )}
        </div>
        <Link
          href={`/mentors/${slug}`}
          className="text-white/80 hover:text-white transition-colors flex-shrink-0 ml-2"
          aria-label={`View ${mentor.name}'s profile`}
        >
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <style>{`
        .skeleton-shimmer {
          background: linear-gradient(90deg, #3a3f47 25%, #565c66 37%, #3a3f47 63%);
          background-size: 400% 100%;
          animation: skeleton-shimmer-move 1.4s ease-in-out infinite;
        }
        @keyframes skeleton-shimmer-move {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-shimmer { animation: none; }
        }
      `}</style>
    </div>
  )
}

interface MeetOurMentorsProps {
  mentors: Mentor[]
}

export function MeetOurMentors({ mentors }: MeetOurMentorsProps) {
  return (
    <div id="mentors">
      <h2
        className="text-2xl font-bold mb-6 sm:mb-8"
        style={{ color: '#0B0E14' }}
      >
        Meet Our Mentors
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {mentors.map((mentor, idx) => (
          <MentorCard key={mentor.id} mentor={mentor} index={idx} />
        ))}
      </div>
    </div>
  )
}