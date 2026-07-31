'use client'

import { useState, useRef } from 'react'

const WHY_ITEMS = [
  {
    number: '1',
    title: "Discipleship & God’s purpose",
    description:
      "Align your career with your calling, live intentionally, and reflect Christ’s values daily in a competitive marketplace.",
    image: '/assets/Gallery1.jpg',
    imageAlt: 'Person in worship',
  },
  {
    number: '2',
    title: 'Career Success & fulfilment',
    description:
      'Maximize your professional potential. Develop talents, skills, and character to help you achieve meaningful work, true excellence, and lasting industry impact. ',
    image: '/assets/Gallery3.jpg',
    imageAlt: 'Group of professionals',
  },
  {
    number: '3',
    title: 'Future Talent Readiness',
    description:
      'Prepare for your next breakthrough. Equip yourself with the strategic mindset and core competence needed to step into and succeed in emerging leadership roles.',
    image: '/assets/Gallery2.jpg',
    imageAlt: 'Professional women smiling',
  },
]

export function WhyWorkplaceNetwork() {
  const [activeIndex, setActiveIndex] = useState(1) // default middle
  const touchStartX = useRef<number | null>(null)

  const prev = () => setActiveIndex((i) => Math.max(i - 1, 0))
  const next = () => setActiveIndex((i) => Math.min(i + 1, WHY_ITEMS.length - 1))

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (diff > 40) next()
    else if (diff < -40) prev()
    touchStartX.current = null
  }

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto ">

        {/* ── md+ : desktop & tablet ── */}
        <div className="hidden md:block">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: '#0B0E14' }}>
            WHY Workplace Network
          </h2>

          {/* Numbered titles + descriptions */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            {WHY_ITEMS.map((item) => (
              <div key={item.number}>
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: '#0B0E14' }}
                  >
                    {item.number}
                  </span>
                  <h3 className="font-bold text-base text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* 3-column images */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {WHY_ITEMS.map((item) => (
              <div key={item.number} className="rounded-2xl overflow-hidden" style={{ aspectRatio: '2/3' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Wordmark — same approach as your original, just tightened */}
          <div className="mt-6">
            <p
              className="font-black tracking-tight flex justify-center leading-none"
              style={{
                color: '#0B0E14',
                letterSpacing: '-0.02em',
                fontSize: 'clamp(1.5rem, 4vw, 4rem)',
              }}
            >
              <span>CHRISTIAN</span>{' '}
              <span className="font-normal text-gray-400">PROFESSIONAL NETWORK</span>
            </p>
          </div>
        </div>

        {/* ── Mobile (below md) ── */}
        <div className="md:hidden relative">

          {/* Radial warm blob — white bg with centre glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255, 220, 140, 0.35) 0%, rgba(255, 255, 255, 0) 70%)',
            }}
          />

          <h2
            className="text-xl font-bold text-center mb-6 relative z-10"
            style={{ color: '#0B0E14' }}
          >
            Why Workplace Network
          </h2>

          {/* Active card title */}
          <p className="text-center font-bold text-base text-gray-900 mb-5 relative z-10 transition-all duration-300">
            {WHY_ITEMS[activeIndex].title}
          </p>

          {/* Carousel */}
          <div
            className="relative z-10 flex items-end justify-center overflow-hidden"
            style={{ gap: '10px' }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {WHY_ITEMS.map((item, i) => {
              const offset = i - activeIndex
              const isActive = offset === 0
              const isVisible = Math.abs(offset) === 1

              if (!isActive && !isVisible) return null

              return (
                <div
                  key={item.number}
                  onClick={() => setActiveIndex(i)}
                  className="flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    // Side cards: sliver only — just enough to show edge
                    width: isActive ? '62vw' : '9vw',
                    // Same aspect ratio but active is slightly taller via height
                    height: isActive ? '82vw' : 'calc(72vw * 0.9)',
                    aspectRatio: isActive ? '2.5/4' : undefined,
                    opacity: isActive ? 1 : 0.6,
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    flexShrink: 0,
                    marginBottom: isActive ? '5px' : '20px'
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
              )
            })}
          </div>

          {/* Description + wordmark — constrained to card width */}
          <div className="mx-auto mt-6 relative z-10" style={{ width: '72vw' }}>
            <p className="text-gray-700 text-sm leading-relaxed mb-6 transition-all duration-300">
              {WHY_ITEMS[activeIndex].description}
            </p>
            <p
              className="font-black leading-tight"
              style={{
                color: '#0B0E14',
                letterSpacing: '-0.02em',
                fontSize: 'clamp(0.85rem, 4vw, 1.1rem)',
              }}
            >
              CHRISTIAN{' '}
              <span className="font-normal" style={{ color: '#6B7280' }}>
                PROFESSIONAL NETWORK
              </span>
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}