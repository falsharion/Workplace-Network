'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin } from 'lucide-react'
import type { Event } from '@/types/database'

interface CuratedEventsProps {
  events: Event[]
}

function CuratedEventCard({ event }: { event: Event }) {
  const date = new Date(event.start_at)
  const monthShort = date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()
  const day = date.getDate()
  const year = date.getFullYear()
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' })
  const flyer = (event as any).flyer_url as string | undefined

  return (
    <>
      {/* ── Desktop card (lg+): date block on left, content middle, flyer right ── */}
      <div className="hidden lg:flex items-stretch bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
        {/* Date block */}
        <div className="flex-shrink-0 w-[88px] shadow-md flex flex-col items-center justify-center  pt-4 pb-4 px-2">
          <div className='shadow-sm bg-cream flex flex-col items-center justify-center pt-1'>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{monthShort}</p>
          <p className="text-2xl font-bold text-gray-900 leading-none">{day}</p>
          <p className="text-xs text-gray-500">{year}</p>
          <div
            className="mt-2  px-2 py-1 text-[10px] font-semibold text-white text-center w-full"
            style={{ backgroundColor: '#3B3020' }}
          >
            {time}
          </div>
          </div>
        </div>

        {/* Content — middle */}
        <div className="flex-1 min-w-0 flex flex-col justify-center py-4 px-3">
          <p className="text-gray-600 text-[10px] font-medium uppercase tracking-widest mb-0.5">
            {(event as any).category ?? 'A Career & Work Conference'}
          </p>
          <h4 className="text-gray-900 font-bold text-base mb-1 truncate">{event.name}</h4>
          {event.scripture_reference && (
            <p className="text-gray-500 text-xs mb-2">{event.scripture_reference}</p>
          )}
          <div className="flex items-center gap-1 bg-yellow-100 w-16 text-gray-500">
            <MapPin size={10} />
            <span className="text-xs truncate">
              {event.is_virtual ? 'Virtual' : event.location ?? 'In Person'}
            </span>
          </div>
        </div>

        {/* Flyer image — right, flush, tall */}
        <div className="flex-shrink-0 w-[140px] sm:w-[160px]">
          {flyer ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={flyer}
              alt={`${event.name} flyer`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-300 text-xs">No flyer</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile card (below lg): no date block, inline date as text ── */}
      <div className="flex lg:hidden items-stretch bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
        {/* Content — left */}
        <div className="flex-1 min-w-0 flex flex-col justify-center py-4 px-4">
          <p className="text-gray-400 text-[10px] font-medium uppercase tracking-widest mb-1">
            {(event as any).category ?? 'A Career & Work Conference'}
          </p>
          <h4 className="text-gray-900 font-bold text-base mb-1 leading-snug">{event.name}</h4>
          <p className="text-gray-500 text-xs mb-2">
            {weekday}, {day} {monthShort} &bull; {time}
          </p>
          <div className="inline-flex items-center gap-1 border border-gray-200 rounded-full px-2 py-0.5 w-fit">
            <MapPin size={10} className="text-gray-400" />
            <span className="text-xs text-gray-500 truncate">
              {event.is_virtual ? 'Virtual' : event.location ?? 'In Person'}
            </span>
          </div>
        </div>

        {/* Flyer image — right, flush */}
        <div className="flex-shrink-0 w-[130px]">
          {flyer ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={flyer}
              alt={`${event.name} flyer`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full min-h-[120px] bg-gray-100 flex items-center justify-center">
              <span className="text-gray-300 text-xs">No flyer</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export function CuratedEvents({ events }: CuratedEventsProps) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [visible, setVisible] = useState(true)
  const [displayedTab, setDisplayedTab] = useState<'upcoming' | 'past'>('upcoming')
  const [listHeight, setListHeight] = useState<number | undefined>(undefined)
  const listRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const now = new Date()
  const upcoming = events.filter((e) => new Date(e.start_at) > now)
  const past = events.filter((e) => new Date(e.start_at) <= now)
  const displayed = displayedTab === 'upcoming' ? upcoming : past

  // Lock the list container height before fading out so the layout below doesn't shift
  function switchTab(next: 'upcoming' | 'past') {
    if (next === tab) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Capture current rendered height to hold the space during transition
    if (listRef.current) {
      setListHeight(listRef.current.offsetHeight)
    }

    setVisible(false)
    setTab(next)

    timeoutRef.current = setTimeout(() => {
      setDisplayedTab(next)
      setVisible(true)
      // Release fixed height after new content paints
      setTimeout(() => setListHeight(undefined), 200)
    }, 180)
  }

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])

  const TabToggle = () => (
    <div
      className="flex rounded-lg border gap-0"
      style={{ borderColor: '#E8A33D', backgroundColor: 'transparent' }}
    >
      <button
        onClick={() => switchTab('upcoming')}
        className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
        style={
          tab === 'upcoming'
            ? { backgroundColor: '#E8A33D', color: '#fff' }
            : { backgroundColor: 'transparent', color: '#6B7280' }
        }
      >
        Upcoming
      </button>
      <button
        onClick={() => switchTab('past')}
        className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
        style={
          tab === 'past'
            ? { backgroundColor: '#E8A33D', color: '#fff' }
            : { backgroundColor: 'transparent', color: '#6B7280' }
        }
      >
        Past
      </button>
    </div>
  )

  return (
    <section className="bg-white  py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Mobile layout (below lg) ── */}
        <div className="lg:hidden">
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#0B0E14' }}>
            Curated Events
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-5">
            Connect, learn, and grow through thoughtfully organized professional and faith-based events.
          </p>

          {/* Tabs + View all row */}
          <div className="flex items-center justify-between mb-5">
            <TabToggle />
            <button className="text-sm font-semibold" style={{ color: '#E8A33D' }}>
              View all
            </button>
          </div>

          {/* Event list */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 180ms ease',
              height: listHeight !== undefined ? `${listHeight}px` : 'auto',
              overflow: listHeight !== undefined ? 'hidden' : 'visible',
            }}
            ref={listRef}
          >
            {displayed.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">No {displayedTab} events found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayed.map((event) => (
                  <CuratedEventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Desktop layout (lg+): sticky left, scrollable right ── */}
        <div className="hidden lg:grid lg:grid-cols-[320px_1fr] gap-16 items-start">

          {/* Left: sticky title + description */}
          <div className="lg:sticky lg:top-28 self-start">
            <h2 className="text-2xl xl:text-3xl font-bold mb-2" style={{ color: '#0B0E14' }}>
              Curated Events
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Connect, learn, and grow through thoughtfully organized professional and faith-based events.
            </p>
          </div>

          {/* Right: tabs + event list */}
          <div className="flex-1 min-w-0 borde">
            {/* Tabs — top right */}
            <div className="flex justify-end mb-5">
              <TabToggle />
            </div>

            {/* Event list with fade + locked height during transition */}
            <div
              ref={listRef}
              style={{
                opacity: visible ? 1 : 0,
                transition: 'opacity 180ms ease',
                height: listHeight !== undefined ? `${listHeight}px` : 'auto',
                overflow: listHeight !== undefined ? 'hidden' : 'visible',
              }}
            >
              {displayed.length === 0 ? (
                <div className="text-center py-12 ">
                  <p className="text-gray-400 text-sm">No {displayedTab} events found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayed.map((event) => (
                    <CuratedEventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}