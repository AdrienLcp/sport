import { useEffect, useRef, useState } from 'react'

import { usePrefersReducedMotion } from '@/infrastructure/browser'
import { nowMs } from '@/infrastructure/clock'

/**
 * How often the count is read again. Every number printed from it — whole
 * seconds left, seconds held rounded — turns on a half second; the rule under
 * the head glides on its own (`Chrono.run`). Reduced motion reads whole
 * seconds, so the rule steps instead of gliding and still says the same.
 */
const READ_EVERY_MS = 500
const READ_EVERY_MS_REDUCED = 1000

/**
 * Seconds since `resetKey` last changed, while `isRunning`, on the last half
 * second passed. Read from the wall clock rather than accumulated, so a
 * backgrounded tab comes back with the right number instead of a rest that
 * never ended.
 */
export const useElapsed = (
  isRunning: boolean,
  resetKey: string
): {
  seconds: number
  /** The exact seconds at this instant, for the moment a set is logged. */
  readExactSeconds: () => number
} => {
  const isReduced = usePrefersReducedMotion()
  const [tick, setTick] = useState({ key: resetKey, seconds: 0 })
  const run = useRef<{ key: string; startedAt: number } | null>(null)

  useEffect(() => {
    if (!isRunning) return

    const every = isReduced ? READ_EVERY_MS_REDUCED : READ_EVERY_MS
    const startedAt = nowMs()
    run.current = { key: resetKey, startedAt }
    let timer = 0
    const read = () => {
      const passed = nowMs() - startedAt
      const reads = Math.floor(passed / every)
      setTick({ key: resetKey, seconds: (reads * every) / 1000 })
      timer = window.setTimeout(read, (reads + 1) * every - passed)
    }
    timer = window.setTimeout(read, every)
    return () => {
      window.clearTimeout(timer)
      run.current = null
    }
  }, [isRunning, isReduced, resetKey])

  const readExactSeconds = () =>
    run.current?.key === resetKey ? (nowMs() - run.current.startedAt) / 1000 : 0

  // The value carries the station that produced it: a station that has not
  // started yet reads zero, with no reset inside an effect.
  return {
    readExactSeconds,
    seconds: tick.key === resetKey ? tick.seconds : 0
  }
}

/** `m:ss`, never below zero: what the rest plate and the band print. */
export const formatCount = (seconds: number): string => {
  const whole = Math.max(0, Math.ceil(seconds))
  const minutes = Math.floor(whole / 60)
  return `${minutes}:${String(whole % 60).padStart(2, '0')}`
}
