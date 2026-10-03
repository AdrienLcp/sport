import { useSyncExternalStore } from 'react'

import { zonedNow } from '@/infrastructure/clock'

import { subscribeToClockTicks } from './clock-ticks'

const wallMinute = (): string =>
  zonedNow()
    .toPlainDateTime()
    .round({ roundingMode: 'floor', smallestUnit: 'minute' })
    .toString()

/** The local date and time, to the minute. */
export const useWallMinute = (): Temporal.PlainDateTime =>
  Temporal.PlainDateTime.from(
    useSyncExternalStore(subscribeToClockTicks, wallMinute)
  )
