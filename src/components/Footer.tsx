import Link from 'next/link'

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#events', label: 'Events' },
  { href: '#groups', label: 'Groups' },
]

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.675 0h-21.35C.59 0 0 .589 0 1.316v21.369C0 23.411.589 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.411 24 24 23.411 24 22.685V1.316C24 .589 23.411 0 22.675 0z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 5.82c-1.11-1.09-1.68-2.51-1.71-4.14h-3.03v13.93c0 1.62-1.32 2.93-2.94 2.93-1.62 0-2.94-1.31-2.94-2.93 0-1.62 1.32-2.93 2.94-2.93.31 0 .6.05.88.13V9.72c-.29-.04-.58-.06-.88-.06-3.27 0-5.92 2.65-5.92 5.91S6.55 21.48 9.82 21.48s5.92-2.65 5.92-5.91V8.41c1.26.9 2.8 1.43 4.46 1.43V6.81c-.93 0-1.8-.28-2.53-.76-.4-.26-.76-.58-1.07-.94-.06-.07-.13-.15-.19-.23-.31-.4-.55-.85-.71-1.34-.06-.19-.11-.4-.14-.61" />
    </svg>
  )
}

const SOCIAL_LINKS = [
  {
    href: 'https://www.linkedin.com/company/workplace-network-community/',
    label: 'LinkedIn',
    Icon: LinkedInIcon,
  },
  {
    href: 'https://www.instagram.com/workplacenetwork_/',
    label: 'Instagram',
    Icon: InstagramIcon,
  },
  {
    href: 'https://www.facebook.com/share/1QJP8ca4uo/',
    label: 'Facebook',
    Icon: FacebookIcon,
  },
  {
    href: 'https://www.tiktok.com/@workplacenetwork',
    label: 'TikTok',
    Icon: TikTokIcon,
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: '#0B0E14' }} className="pt-10 pb-6">
      <div className="max-w-5xl w-full  md:max-w-2xl lg:max-w-4xl mx-auto px-7 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6">
          {/* Logo */}
          <div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight" style={{ color: '#E8A33D' }}>
                workplace
              </span>
              <span className="text-[9px] font-medium tracking-widest text-white/30 uppercase leading-none">
                NEW WORK | NEW WAYS
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/60 text-sm hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
                aria-label={label}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-5">
          <p className="text-white/30 text-xs">
            © {year} Workplace Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}