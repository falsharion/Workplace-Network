'use client'

import { useState, useEffect, useCallback } from 'react'

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

function calculateTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now()

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, expired: false }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function Countdown({ targetDate, onExpire }: CountdownProps) {
const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  const tick = useCallback(() => {
    const next = calculateTimeLeft(targetDate)
    setTimeLeft(next)
    if (next.expired) {
      onExpire?.()
    }
  }, [targetDate, onExpire])

useEffect(() => {
  tick() // run immediately on mount
  const interval = setInterval(tick, 1000)
  return () => clearInterval(interval)
}, [tick])

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
            <span className="block text-white/50 text-[10px] sm:text-xs mt-1 font-medium">{unit.label}</span>
          </div>
          {idx < units.length - 1 && (
            <span className="text-white/40 text-2xl sm:text-3xl font-light pb-4">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
