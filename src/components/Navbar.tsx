'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Info, CalendarDays, Users, Newspaper, ChevronRight } from 'lucide-react'

const NAV_LINKS = [
  { hash: 'about',    label: 'About',   icon: Info },
  { hash: 'events',   label: 'Events',  icon: CalendarDays },
  { hash: 'groups',   label: 'Groups',  icon: Users },
  // { hash: 'articles', label: 'Blogs',   icon: Newspaper },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  // Lock body scroll while the curtain menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-[0.5rem]">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/assets/Logo(white).svg" alt="logo" className="h-8 w-auto lg:h-14" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-11">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.hash}
                href={isHome ? `#${link.hash}` : `/#${link.hash}`}
                className="text-base font-medium text-gray-700 hover:text-navy transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Sign In + Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* <Link
              href="/sign-in"
              className="hidden md:inline-flex items-center px-4 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link> */}

            <button
              className="md:hidden p-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile curtain menu — drops down from the header, retracts back up on close */}
      <div
        aria-hidden={!mobileOpen}
        className={`md:hidden fixed inset-x-0 top-14 sm:top-16 z-40 overflow-hidden bg-navy transition-[height] duration-500 ease-in-out ${
          mobileOpen ? 'h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)]' : 'h-0'
        }`}
      >
        <div className="flex flex-col px-6 py-6">
          <nav className="flex flex-col">
            {NAV_LINKS.map((link, i) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.hash}
                  href={isHome ? `#${link.hash}` : `/#${link.hash}`}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between py-4 border-b border-white/10 transition-all duration-200 ease-out ${
                    mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                  style={{ transitionDelay: mobileOpen ? `${i * 50 + 150}ms` : '0ms' }}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} className="text-white/60" />
                    <span className="text-lg font-medium text-white">{link.label}</span>
                  </span>
                  <ChevronRight size={18} className="text-white/30" />
                </Link>
              )
            })}
          </nav>

          <div
            className={`flex gap-3 pt-6 mt-2 border-t border-white/10 transition-all duration-200 ease-out ${
              mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ transitionDelay: mobileOpen ? `${NAV_LINKS.length * 50 + 150}ms` : '0ms' }}
          >
            <Link
              href="/sign-in"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-4 py-3 rounded-full text-sm font-medium text-white border border-white/30 hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}