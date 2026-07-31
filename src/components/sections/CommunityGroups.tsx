'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ExperienceGroup } from '@/lib/groups.server'

const GROUP_COLORS = ['#1C2030', '#0F172A', '#1E293B']

interface GroupCardProps {
  group: ExperienceGroup
  index: number
  mobile?: boolean
}

function GroupCard({ group, index, mobile = false }: GroupCardProps) {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-100 shadow-sm w-full">
      {/* Header */}
      <div
        className={`relative flex items-end p-4 overflow-hidden ${mobile ? 'h-56' : 'h-28 p-3'}`}
        style={{ backgroundColor: GROUP_COLORS[index % GROUP_COLORS.length] }}
      >
        {/* Large faint watermark of the headline number, e.g. "5-9" or "10+" */}
        <span
          aria-hidden
          className={`absolute -right-3 -top-6 font-extrabold text-white/10 select-none leading-none ${
            mobile ? 'text-[9rem]' : 'text-[5.5rem]'
          }`}
        >
          {group.name.split(' ')[0]}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <p className={`relative text-white font-semibold z-10 ${mobile ? 'text-lg' : 'text-sm'}`}>
          {group.name}
        </p>
      </div>

      {/* Body */}
      <div className={`flex-1 bg-white flex flex-col justify-between ${mobile ? 'p-6 gap-6' : 'p-4 gap-4'}`}>
        <p className={`text-gray-500 leading-relaxed ${mobile ? 'text-base' : 'text-xs'}`}>
          {group.description}
        </p>

        <Link
          href={`/join-group?group=${group.slug}`}
          className={`inline-flex items-center gap-1 font-medium transition-colors hover:opacity-80 ${
            mobile ? 'text-blue-600 text-base' : 'text-gray-600 text-xs hover:text-gray-900'
          }`}
        >
          Join Group {mobile ? <ArrowRight size={16} /> : <ArrowRight size={12} />}
        </Link>
      </div>
    </div>
  )
}

interface CommunityGroupsProps {
  groups: ExperienceGroup[]
}

export function CommunityGroups({ groups }: CommunityGroupsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section id="groups" className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto ">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <p className="text-gray-400 text-sm  md:text-lg mb-1">Community Groups</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Find Your Specific Circle
            </h2>
          </div>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-sm md:max-w-xs lg:max-w-sm">
            True growth requires the right context. Our mentorship groups are organized by years
            of experience, so you learn and grow alongside peers who are at a similar stage in
            their career.
          </p>
        </div>

        {/* ── Mobile: full-width single card with dot pagination (below md) ── */}
        <div className="md:hidden">
          <GroupCard group={groups[activeIndex]} index={activeIndex} mobile />

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-5">
            {groups.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-6 h-2.5 bg-gray-800'
                    : 'w-2.5 h-2.5 bg-gray-300'
                }`}
                aria-label={`Go to group ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── md+: 3-column grid (one card per experience group) ── */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {groups.map((group, idx) => (
            <GroupCard key={group.slug} group={group} index={idx} />
          ))}
        </div>

      </div>
    </section>
  )
}