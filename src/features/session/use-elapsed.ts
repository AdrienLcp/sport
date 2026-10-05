import { useEffect, useState } from 'react'

import { usePrefersReducedMotion } from '@/infrastructure/browser'
import { nowMs } from '@/infrastructure/clock'

/**
 * Seconds since `resetKey` last changed, while `isRunning`. Read from the wall
 * clock rather than accumulated per frame, so a backgrounded tab comes back
 * with the right number instead of a rest that never ended.
 *
 * Reduced motion gets whole seconds: the chrono rule then steps instead of
 * gliding, and it still says exactly the same thing.
 */
export const useElapsed = (isRunning: boolean, resetKey: string): number => {
  const isReduced = usePrefersReducedMotion()
  const [tick, setTick] = useState({ key: resetKey, seconds: 0 })

  useEffect(() => {
    if (!isRunning) return

    const startedAt = nowMs()

    if (isReduced) {
      const timer = window.setInterval(
        () =>
          setTick({
            key: resetKey,
            seconds: Math.floor((nowMs() - startedAt) / 1000)
          }),
        250
      )
      return () => window.clearInterval(timer)
    }

    const read = () => ({
      key: resetKey,
      seconds: (nowMs() - startedAt) / 1000
    })
    let frame = 0
    const step = () => {
      setTick(read)
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [isRunning, isReduced, resetKey])

  // The value carries the station that produced it: a station that has not
  // started yet reads zero, with no reset inside an effect.
  return tick.key === resetKey ? tick.seconds : 0
}

/** `m:ss`, never below zero: what the rest plate and the band print. */
export const formatCount = (seconds: number): string => {
  const whole = Math.max(0, Math.ceil(seconds))
  const minutes = Math.floor(whole / 60)
  return `${minutes}:${String(whole % 60).padStart(2, '0')}`
}
