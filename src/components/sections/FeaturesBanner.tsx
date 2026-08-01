'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, UserCheck, Calendar, MessageCircle } from 'lucide-react'

const FEATURES = [
  {
    icon: Users,
    title: 'Join Groups',
    description: 'Engage with like-minded professionals who align with your passions.',
  },
  {
    icon: UserCheck,
    title: 'Connect with Mentors',
    description: 'Partner with seasoned corporate executives to accelerate your professional growth.',
  },
  {
    icon: Calendar,
    title: 'Attend Events',
    description: 'Access specialized masterclasses and panels to upgrade your skill set.',
  },
  {
    icon: MessageCircle,
    title: 'Network & Chat',
    description: 'Build strategic, lasting and valuable relationships by engaging in direct communication.',
  },
]

// Small reusable "reveal on scroll" hook — fires once when the element
// enters the viewport, then disconnects.
function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, ...options }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [options])

  return { ref, inView }
}

export function FeaturesBanner() {
  const { ref: headerRef, inView: headerInView } = useInView<HTMLDivElement>()
  const { ref: cardsRef, inView: cardsInView } = useInView<HTMLDivElement>({ threshold: 0.1 })

  return (
    <section className="relative">
      <style>{`
        @keyframes featuresBgZoom {
          from { transform: scale(1.08); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="relative overflow-hidden flex flex-col justify-between min-h-[480px] sm:min-h-[520px]">
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/Heroimages/feautures.jpg"
          alt="Conference audience"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ animation: 'featuresBgZoom 1.6s ease-out forwards' }}
          loading="lazy"
        />
        {/* Blue overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ background: 'rgb(0 10 36 / 65%)' }}
        />

        {/* Text content */}
        <div
          ref={headerRef}
          className={`w-full max-w-5xl md:max-w-2xl lg:max-w-4xl mx-auto relative z-10 px-7 sm:px-6 lg:px-8 pt-10 sm:pt-14 transition-all duration-700 ease-out ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-white/70 text-xs sm:text-sm font-medium mb-2 tracking-wide">
            Thrive professionally and spiritually
          </p>
          <h2
            className="text-white font-bold text-2xl sm:text-3xl leading-tight max-w-md"
            style={{ letterSpacing: '-0.01em' }}
          >
            Everything you need to connect and grow
          </h2>
        </div>

        {/* Feature cards */}
        <div
          ref={cardsRef}
          className="relative z-10 mx-auto w-full max-w-5xl md:max-w-2xl lg:max-w-4xl px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 mt-8"
        >
          {/* Mobile only (below sm): large horizontal scroll cards */}
          <div className="flex gap-4 overflow-x-auto -mx-4 px-4 pb-2 sm:hidden">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className={`flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 transition-all duration-700 ease-out hover:bg-white/15 hover:border-white/30 ${
                  cardsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ width: '260px', transitionDelay: cardsInView ? `${i * 90}ms` : '0ms' }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105">
                  <feature.icon size={24} className="text-indigo-700" />
                </div>
                <h3 className="font-bold text-base text-white mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* sm+ : 4-column grid */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className={`group bg-white rounded-2xl p-4 shadow-md transition-all duration-700 ease-out hover:-translate-y-1.5 hover:shadow-xl ${
                  cardsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: cardsInView ? `${i * 90}ms` : '0ms' }}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mb-3 transition-colors duration-300 group-hover:bg-indigo-50">
                  <feature.icon
                    size={16}
                    className="text-gray-600 transition-transform duration-300 group-hover:scale-110 group-hover:text-indigo-600"
                  />
                </div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1.5">{feature.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}