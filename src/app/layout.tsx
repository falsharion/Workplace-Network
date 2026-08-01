import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// @ts-ignore
import './globals.css'
// @ts-ignore
import 'react-phone-number-input/style.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Workplace Network — Connect. Grow. Thrive with Christian Professionals',
  description:
    'Build your profile, connect with mentors, join groups, and unlock career opportunities in a faith-centered community.',
   icons: {
    icon: '/assets/Logo(white)(1).svg',
  },
    openGraph: {
    title: 'Workplace Network',
    description: 'A faith-based mentoring and networking platform for Christian career professionals.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
