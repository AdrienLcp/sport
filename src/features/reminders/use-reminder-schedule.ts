import { useEffect, useRef, useState } from 'react'

import { zonedNow } from '@/infrastructure/clock'
import { useTranslate } from '@/presentation/i18n/i18n-provider'
import { useLatestOnly } from '@/presentation/use-latest-only'

import { reminderCopyOf } from './reminder-copy'
import { readReminderSchedule, saveReminderSchedule } from './reminder-device'
import type { ReminderSchedule } from './reminder-schedule'

/** Builds the next schedule from the one held now, not from one captured earlier. */
export type ReminderUpdate = (current: ReminderSchedule) => ReminderSchedule

/**
 * The schedule as this device holds it — `null` for the instant IndexedDB
 * takes to answer — and the hand that changes it. Every change is saved at
 * once, with the reminder's words in the language the reader is using now;
 * a newer change aborts the save still in flight, and so does leaving.
 */
export const useReminderSchedule = (): readonly [
  ReminderSchedule | null,
  (update: ReminderUpdate) => void
] => {
  const translate = useTranslate()
  const [schedule, setSchedule] = useState<ReminderSchedule | null>(null)
  const held = useRef<ReminderSchedule | null>(null)
  const saves = useLatestOnly()

  useEffect(() => {
    const controller = new AbortController()
    void readReminderSchedule(controller.signal).then((read) => {
      if (read.status === 'failure') return
      held.current = read.data
      setSchedule(read.data)
    })
    return () => controller.abort()
  }, [])

  const keep = (update: ReminderUpdate) => {
    if (held.current === null) return
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
