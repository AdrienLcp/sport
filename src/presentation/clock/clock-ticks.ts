import { nowMs } from '@/infrastructure/clock'

const MINUTE_MS = 60_000

/** A phone woken from sleep, a tab brought back: the page is seen again. */
const PAGE_SEEN_AGAIN_EVENTS = ['visibilitychange', 'focus', 'pageshow']

export const msUntilNextMinute = (nowMs: number): number =>
  MINUTE_MS - (nowMs % MINUTE_MS)

/**
 * Calls `onTick` at every turn of the minute and whenever the page is seen
 * again. The second matters as much as the first: a phone asleep overnight
 * resumes with timers that fired late or not at all, and a PWA left open is
 * resumed, never reloaded.
 */
export const subscribeToClockTicks = (
  onTick: () => void,
  page: EventTarget = window
): (() => void) => {
  let timer: ReturnType<typeof setTimeout> | undefined

  const armNextMinute = () => {
    timer = setTimeout(() => {
      onTick()
      armNextMinute()
    }, msUntilNextMinute(nowMs()))
  }

  const tickNow = () => {
    clearTimeout(timer)
    onTick()
    armNextMinute()
  }

  for (const event of PAGE_SEEN_AGAIN_EVENTS) {
    page.addEventListener(event, tickNow)
  }
  armNextMinute()

  return () => {
    clearTimeout(timer)
    for (const event of PAGE_SEEN_AGAIN_EVENTS) {
      page.removeEventListener(event, tickNow)
    }
  }
}
