'use client'

import { useState, useEffect, useRef } from 'react'

interface CountdownProps {
  targetDate: Date
  onExpire?: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function calculateTimeLeft(targetMs: number): TimeLeft {
  const diff = targetMs - Date.now()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    expired: false,
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function Countdown({ targetDate, onExpire }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  // Depend on the number, not the Date object, so a new Date on every
  // parent render doesn't restart the interval
  const targetMs = targetDate.getTime()

  // Always call the latest onExpire without it being an effect dependency
  const onExpireRef = useRef(onExpire)
  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    const tick = () => {
      const next = calculateTimeLeft(targetMs)
      setTimeLeft(next)
      if (next.expired) {
        clearInterval(interval) // stop ticking once expired
        onExpireRef.current?.() // fires once
      }
    }

    const interval = setInterval(tick, 1000)
    tick() // run immediately on mount
    return () => clearInterval(interval)
  }, [targetMs])

  const units = [
    { label: 'days', value: timeLeft?.days },
    { label: 'hours', value: timeLeft?.hours },
    { label: 'minutes', value: timeLeft?.minutes },
    { label: 'seconds', value: timeLeft?.seconds },
  ]

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {units.map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
          <div className="text-center">
            <span className="block text-3xl sm:text-4xl font-bold text-white tabular-nums leading-none">
              {unit.value === undefined ? '--' : pad(unit.value)}
            </span>
            <span className="block text-white/50 text-[10px] sm:text-xs mt-1 font-medium">
              {unit.label}
            </span>
          </div>
          {idx < units.length - 1 && (
            <span className="text-white/40 text-2xl sm:text-3xl font-light pb-4">:</span>
          )}
        </div>
      ))}
    </div>
  )
}