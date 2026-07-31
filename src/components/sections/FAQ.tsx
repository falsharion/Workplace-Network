'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { FAQ_ITEMS } from '@/lib/fallback-data'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  function toggle(idx: number) {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: heading */}
          <div>
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
                <div key={idx}>
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between py-4 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span className={`text-sm font-medium pr-4 ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
                      {item.question}
                    </span>
                    <span className="flex-shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors">
                      {isOpen ? <X size={16} /> : <Plus size={16} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pb-4">
                      <p className="text-gray-500 text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
