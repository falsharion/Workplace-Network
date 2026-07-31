'use client'

import { useState } from 'react'
import { MapPin, Sparkles } from 'lucide-react'
import { Countdown } from '@/components/Countdown'
import { RegistrationForm } from '@/components/RegistrationForm'
import type { Event } from '@/types/database'

const REASONS_TO_JOIN = [
  'Thriving in the new work and new ways era.',
  'Insights to setting your career value proposition (CVP) for 2026.',
  'Masterclasses and panel session from industry leaders.',
  'Worship and prayer time.',
]

interface FeaturedEventProps {
  event: Event
}

export function FeaturedEvent({ event }: FeaturedEventProps) {
  const [expired, setExpired] = useState(
    () => new Date(event.start_at) <= new Date()
  )

  const targetDate = new Date(event.start_at)

  const formattedDate = targetDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const formattedTime = targetDate
    .toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .toUpperCase()

  return (
    
    <section
      id="events"
      className=" max-w-5xl w-full lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24"
    >
      max-w-5xl w-full lg:max-w-4xl  bg-white mx-auto px-7 sm:px-6 lg:px-8 py-12 sm:py-16
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            Events
          </h2>
          <p className="text-white/75 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            From weekly mentorship sessions to large-scale conferences,
            <br className="hidden sm:block" />
            our events calendar is packed with opportunities to learn,
            network, and grow.
          </p>
        </div>

        {/* ── Desktop Layout ── */}
        <div className="hidden lg:flex justify-center items-center flex-col gap-10">
          {/* Main white card */}
          <div className="bg-white rounded-[32px] width-[60vw] ">
            <div className="flex gap-12 items-center">
              {/* Flyer */}
              <div className="w-[420px] flex-shrink-0 rounded-2xl overflow-hidden">
                <div className="aspect-[4/5] flex items-center justify-center">
                  {event.flyer_url ? (
                    <img
                      src={event.flyer_url}
                      alt={`${event.name} flyer`}
                      className=" w-10/12 h-8/12 object-cover"
                    />
                  ) : (
                    <FlyerPlaceholder event={event} />
                  )}
                </div>
              </div>

              {/* Event details */}
              <div className="flex-1 max-w-xl">
                <h3 className="text-gray-900 font-semibold text-[15px] mb-4">
                  Reasons to join
                </h3>
                <ul className="space-y-6 mb-14 p-5 ">
                  {REASONS_TO_JOIN.map((reason) => (
                    <li key={reason} className="flex items-start gap-3">
                      <Sparkles
                        size={16}
                        className="mt-1 flex-shrink-0"
                        style={{ color: '#E8A33D' }}
                      />
                      <span className="text-gray-600 text-sm leading-relaxed">
                        {reason}
                      </span>
                    </li>
                  ))}
                </ul>

                <div>
                  <h4 className="text-gray-900 font-semibold text-[15px] mb-3">
                    Target Audience
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {event.description ??
                      'Career and business professionals seeking to make impact'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-2 gap-10 items-center">
            {/* Left section */}
            <div className="flex flex-col items-start">
              <div className="inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-2 mb-5">
                <MapPin size={14} className="text-white/70" />
                <span className="text-white text-sm font-medium">
                  {event.is_virtual
                    ? 'Virtual'
                    : event.location ?? 'In Person'}
                </span>
              </div>

              <p className="text-white text-2xl font-medium mb-6">
                {formattedDate} | {formattedTime}
              </p>

              <Countdown
                targetDate={targetDate}
                onExpire={() => setExpired(true)}
              />
            </div>

            {/* Registration card */}
            <div
              className="rounded-md p-3 md:p-8 pt-6 bg-black border-gray-300  border-[0.5px]/30"
              style={{
                // backgroundColor: 'rgba(255,255,255,0.06)',
                // border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <h3 className="font-bold text-white text-xl mb-6">
                Reserve your spot
              </h3>

              <RegistrationForm
                eventId={event.id}
                disabled={expired}
              />
            </div>
          </div>
        </div>

        {/* ── Mobile Layout ── */}
        <div className="lg:hidden flex flex-col gap-6">
          {/* White card */}
          <div className="bg-white rounded-3xl p-4">
            {/* Flyer */}
            <div className="rounded-2xl overflow-hidden mb-5">
              <div className="w-full aspect-[4/5]">
                {event.flyer_url ? (
                  <img
                    src={event.flyer_url}
                    alt={`${event.name} flyer`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FlyerPlaceholder event={event} />
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-gray-900 font-semibold text-base mb-4">
                Reasons to join
              </h3>

              <ul className="space-y-3 mb-6">
                {REASONS_TO_JOIN.map((reason) => (
                  <li key={reason} className="flex items-start gap-2">
                    <Sparkles
                      size={13}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: '#E8A33D' }}
                    />
                    <span className="text-gray-600 text-sm leading-relaxed">
                      {reason}
                    </span>
                  </li>
                ))}
              </ul>

              <h4 className="text-gray-900 font-semibold text-base mb-2">
                Target Audience
              </h4>

              <p className="text-gray-500 text-sm leading-relaxed">
                {event.description ??
                  'Career and business professionals seeking to make impact'}
              </p>
            </div>
          </div>

          {/* Location + Date + Countdown */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-2">
              <MapPin size={12} className="text-white/60" />
              <span className="text-white/80 text-xs font-medium">
                {event.is_virtual
                  ? 'Virtual'
                  : event.location ?? 'In Person'}
              </span>
            </div>

            <p className="text-white text-sm font-medium">
              {formattedDate} | {formattedTime}
            </p>

            <Countdown
              targetDate={targetDate}
              onExpire={() => setExpired(true)}
            />
          </div>

          {/* Registration form */}
          <div
            className="rounded-3xl p-5"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            <h3 className="font-bold text-white text-base mb-4">
              Reserve your spot
            </h3>

            <RegistrationForm
              eventId={event.id}
              disabled={expired}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function FlyerPlaceholder({ event }: { event: Event }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
      style={{ backgroundColor: '#1a1500' }}
    >
      <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-3">
        workplace
      </p>

      <p className="text-white/50 text-xs mb-4">Skills to Light.</p>

      <p className="text-white font-bold text-xl leading-tight mb-2">
        Your Good Works.
      </p>

      {event.scripture_reference && (
        <p className="text-white/40 text-xs">
          {event.scripture_reference}
        </p>
      )}

      <div className="mt-4 text-white/30 text-xs">
        {new Date(event.start_at).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
      </div>
    </div>
  )
}