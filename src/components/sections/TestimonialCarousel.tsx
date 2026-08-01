'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const TESTIMONIALS = [
  {
    id: '1',
    quote:
      '"If you don\'t build capacity, opportunity will embarrass you."',
    body: "In your career, opportunities will eventually come—promotion, leadership roles, big projects. But if you haven't developed the skills, discipline, and knowledge, those opportunities can expose your unpreparedness instead of elevating you.",
    speaker: 'Pastor Poju Oyemade',
    role: 'Senior Pastor, Covenant Christian Centre',
    photo: '/assets/PastorAdepoju.svg',
  },
  {
    id: '2',
    quote: '"Change your mindset. Change your future."',
    body: "The beliefs you hold shape the life you experience. If you want different results, begin by changing the way you think. A renewed mindset creates new possibilities, breaks limiting patterns, and positions you to fulfill your purpose.",
    speaker: 'Debola Deji-Kurunmi',
    role: 'Author, Speaker, and Founder of IMMERSE Coaching Company',
    photo: '/assets/ddk.jpeg',
  },
]

// Fills its parent (parent controls aspect-ratio/rounding). Shows a shimmer
// skeleton until the image is actually ready, then cross-fades the two.
function TestimonialPhoto({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  // If the image was already cached/decoded before this component mounted,
  // onLoad never fires again — so check img.complete directly as a fallback.
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
  }, [src])

  return (
    <div className="relative w-full h-full bg-gray-200">
      <div
        className={`absolute inset-0 skeleton-shimmer transition-opacity duration-300 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {!errored ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={`w-full h-full object-cover object-top transition-opacity duration-500 ease-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-400">
          <span className="text-white font-semibold text-3xl">{alt.charAt(0)}</span>
        </div>
      )}
    </div>
  )
}

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(node) // trigger once, not on every scroll pass
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const prev = () => {
    setDirection('prev')
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }
  const next = () => {
    setDirection('next')
    setCurrent((c) => (c + 1) % TESTIMONIALS.length)
  }
  const goTo = (i: number) => {
    setDirection(i > current ? 'next' : 'prev')
    setCurrent(i)
  }

  const t = TESTIMONIALS[current]
  const enterClass = direction === 'next' ? 'testimonial-enter-r' : 'testimonial-enter-l'
  const reveal = (extra = '') =>
    `scroll-reveal ${isVisible ? 'is-visible' : ''} ${extra}`

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 bg-cream overflow-hidden">
     <div className=" max-w-5xl md:max-w-2xl w-full lg:max-w-4xl mx-auto px-7 sm:px-6 lg:px-8">

        {/* ── MOBILE layout (hidden md+) ── */}
        <div className="md:hidden">
          <div className={`bg-white rounded-2xl p-6 shadow-sm ${reveal()}`}>
            <div key={`m-${current}`} className={enterClass}>
              <blockquote
                className="font-bold text-lg text-gray-900 leading-snug mb-5 pl-4 border-l-4 border-gray-900"
                style={{ letterSpacing: '-0.01em' }}
              >
                {t.quote}
              </blockquote>

              <div className="rounded-2xl overflow-hidden mb-5 aspect-[4/3]">
                <TestimonialPhoto src={t.photo} alt={t.speaker} />
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-4">{t.body}</p>
              <p className="font-semibold text-gray-900 text-sm">{t.speaker}</p>
            </div>

            {/* Dot indicators */}
            <div className={`flex items-center justify-center gap-2 mt-6 ${reveal('scroll-reveal-delay-2')}`}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 24 : 8,
                    height: 8,
                    backgroundColor: i === current ? '#3B3020' : '#C4B9AC',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── DESKTOP layout (hidden below md) ── */}
        <div className="hidden md:flex gap-10 lg:gap-16 items-center">
          {/* Photo — left side */}
          <div className={`flex-shrink-0 w-52 lg:w-64 ${reveal()}`}>
            <div
              key={`d-photo-${current}`}
              className={`rounded-2xl overflow-hidden aspect-[3/4] ${enterClass}`}
            >
              <TestimonialPhoto src={t.photo} alt={t.speaker} />
            </div>
          </div>

          {/* Quote + body + speaker + arrows — right side */}
          <div className={`flex-1 flex flex-col ${reveal('scroll-reveal-delay-1')}`}>
            <div key={`d-text-${current}`} className={enterClass}>
              <blockquote
                className="font-bold text-2xl lg:text-[28px] text-gray-900 leading-snug mb-5 pl-5 border-l-4 border-gray-900"
                style={{ letterSpacing: '-0.01em' }}
              >
                {t.quote}
              </blockquote>

              <p className="text-gray-500 text-base leading-relaxed mb-5">{t.body}</p>
              <p className="font-semibold text-gray-900 text-sm">{t.speaker}</p>
            </div>

            {/* Arrow buttons — bottom right */}
            <div className={`flex items-center gap-2 mt-8 self-end ${reveal('scroll-reveal-delay-2')}`}>
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 hover:opacity-80 active:scale-90"
                style={{ backgroundColor: '#3B3020', color: '#fff' }}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 hover:opacity-80 active:scale-90"
                style={{ backgroundColor: '#3B3020', color: '#fff' }}
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes testimonial-enter-r {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes testimonial-enter-l {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .testimonial-enter-r { animation: testimonial-enter-r 0.45s cubic-bezier(0.4, 0, 0.2, 1) both; }
        .testimonial-enter-l { animation: testimonial-enter-l 0.45s cubic-bezier(0.4, 0, 0.2, 1) both; }

        .scroll-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .scroll-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .scroll-reveal-delay-1 { transition-delay: 0.12s; }
        .scroll-reveal-delay-2 { transition-delay: 0.24s; }

        .skeleton-shimmer {
          background: linear-gradient(90deg, #e5e0d6 25%, #f3efe6 37%, #e5e0d6 63%);
          background-size: 400% 100%;
          animation: skeleton-shimmer-move 1.4s ease-in-out infinite;
        }
        @keyframes skeleton-shimmer-move {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .testimonial-enter-r, .testimonial-enter-l { animation: none; }
          .scroll-reveal { transition: none; opacity: 1; transform: none; }
          .skeleton-shimmer { animation: none; }
        }
      `}</style>
    </section>
  )
}