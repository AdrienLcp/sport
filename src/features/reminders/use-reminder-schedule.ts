import { useRef, useState } from 'react'

import { zonedNow } from '@/infrastructure/clock'
import { useTranslate } from '@/presentation/i18n/i18n-provider'
import { useLatestOnly } from '@/presentation/use-latest-only'

import { reminderCopyOf } from './reminder-copy'
import { saveReminderSchedule } from './reminder-device'
import type { ReminderSchedule } from './reminder-schedule'

/** Builds the next schedule from the one held now, not from one captured earlier. */
export type ReminderUpdate = (current: ReminderSchedule) => ReminderSchedule

/**
 * The schedule, starting from the one this device held when the page loaded,
 * and the hand that changes it. Every change is saved at once, with the
 * reminder's words in the language the reader is using now; a newer change
 * aborts the save still in flight, and so does leaving.
 */
export const useReminderSchedule = (
  stored: ReminderSchedule
): readonly [ReminderSchedule, (update: ReminderUpdate) => void] => {
  const translate = useTranslate()
  const [schedule, setSchedule] = useState(stored)
  const held = useRef(stored)
  const saves = useLatestOnly()

  const keep = (update: ReminderUpdate) => {
    const next = update(held.current)
    held.current = next
    setSchedule(next)
    void saves.run((signal) =>
      saveReminderSchedule({
        copy: reminderCopyOf(translate),
        now: zonedNow(),
        schedule: next,
        signal
      })
    )
  }

  return [schedule, keep] as const
}
