import { useEffect, useRef } from 'react'

import { playTone } from '@/infrastructure/sound'

const COUNTDOWN_SECONDS = 3

/**
 * Sounds a running clock for a reader who cannot watch it: a tone when it
 * starts, a tick on each of its last three seconds, and a double tone when it
 * reaches zero. `remaining` counts down in seconds; past zero the clock may go
 * on counting overtime, silently.
 */
export const useClockTones = (isRunning: boolean, remaining: number): void => {
  const lastSecond = useRef<number | undefined>(undefined)
  const second = Math.ceil(remaining)

  useEffect(() => {
    if (!isRunning) {
      lastSecond.current = undefined
      return
    }
    const previous = lastSecond.current
    lastSecond.current = second
    if (previous === undefined) {
      if (second > 0) playTone('start')
      return
    }
    if (second === previous) return
    if (second <= 0 && previous > 0) playTone('end')
    else if (second > 0 && second <= COUNTDOWN_SECONDS) playTone('tick')
  }, [isRunning, second])
}
