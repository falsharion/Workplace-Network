'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { FAQ_ITEMS } from '@/lib/fallback-data'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(node)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  function toggle(idx: number) {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section ref={sectionRef} id="faq" className="bg-white py-16 sm:py-20">
      <div className="max-w-5xl w-full  md:max-w-2xl lg:max-w-4xl mx-auto px-7 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: heading */}
          <div className={`faq-reveal ${isVisible ? 'faq-reveal-visible' : ''}`}>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight"
              style={{ color: '#0B0E14' }}
            >
              Frequently Asked<br />Questions
            </h2>
          </div>

          {/* Right: accordion */}
          <div className="space-y-0 divide-y divide-gray-200">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx
              return (
                <div
                  key={idx}
                  className={`faq-reveal ${isVisible ? 'faq-reveal-visible' : ''}`}
                  style={{ transitionDelay: isVisible ? `${Math.min(idx * 70, 400)}ms` : '0ms' }}
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between py-4 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-sm font-medium pr-4 transition-colors duration-200 ${
                        isOpen ? 'text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      {item.question}
                    </span>
                    <span
                      className="flex-shrink-0 text-gray-400 group-hover:text-gray-600 transition-transform duration-300 ease-out"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    >
                      <Plus size={16} />
                    </span>
                  </button>

                  <div className={`faq-panel ${isOpen ? 'faq-panel-open' : ''}`}>
                    <div className="faq-panel-inner">
                      <p
                        className={`text-gray-500 text-sm leading-relaxed pb-4 transition-all duration-300 ${
                          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                        }`}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        .faq-panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-panel-open {
          grid-template-rows: 1fr;
        }
        .faq-panel-inner {
          overflow: hidden;
          min-height: 0;
        }

        .faq-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1), transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .faq-panel { transition: none; }
          .faq-reveal { transition: none; opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  )
}