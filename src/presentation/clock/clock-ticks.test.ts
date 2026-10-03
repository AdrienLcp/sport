import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { msUntilNextMinute, subscribeToClockTicks } from './clock-ticks'

const HALF_MINUTE_BEFORE_MIDNIGHT = Temporal.Instant.from(
  '2026-10-02T23:59:30Z'
).epochMilliseconds

describe('clock ticks', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: HALF_MINUTE_BEFORE_MIDNIGHT })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('[clock] waits for the end of the current minute, not a full one', () => {
    expect(msUntilNextMinute(90_000)).toBe(30_000)
    expect(msUntilNextMinute(120_000)).toBe(60_000)
  })

  it('[clock] ticks at the turn of the minute, then every minute after', () => {
    const onTick = vi.fn()
    const stop = subscribeToClockTicks(onTick, new EventTarget())

    vi.advanceTimersByTime(29_999)
    expect(onTick).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onTick).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(60_000)
    expect(onTick).toHaveBeenCalledTimes(2)
    stop()
  })

  it('[clock] reads the time again when a page left open is seen again', () => {
    const page = new EventTarget()
    const onTick = vi.fn()
    const stop = subscribeToClockTicks(onTick, page)

    page.dispatchEvent(new Event('visibilitychange'))
    page.dispatchEvent(new Event('focus'))
    page.dispatchEvent(new Event('pageshow'))

    expect(onTick).toHaveBeenCalledTimes(3)
    stop()
  })

  it('[clock] stops ticking once unsubscribed', () => {
    const page = new EventTarget()
    const onTick = vi.fn()
    subscribeToClockTicks(onTick, page)()

    page.dispatchEvent(new Event('visibilitychange'))
    vi.advanceTimersByTime(120_000)

    expect(onTick).not.toHaveBeenCalled()
  })
})
