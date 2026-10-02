import { useSyncExternalStore } from 'react'

import { type IsoDay, todayIsoDay } from '@/helpers/days'

import { subscribeToClockTicks } from './clock-ticks'

/**
 * The local calendar day, read again at every minute and whenever the page is
 * seen again — so a plate left open past midnight writes on the new day.
 */
export const useToday = (): IsoDay =>
  useSyncExternalStore(subscribeToClockTicks, todayIsoDay)
