import { useEffect, useState } from 'react'

import { useTranslate } from '@/presentation/i18n/i18n-provider'

import { reminderCopyOf } from './reminder-copy'
import { readReminderSchedule, saveReminderSchedule } from './reminder-device'
import type { ReminderSchedule } from './reminder-schedule'

/**
 * The schedule as this device holds it — `null` for the instant IndexedDB
 * takes to answer — and the hand that changes it. Every change is saved at
 * once, with the reminder's words in the language the reader is using now.
 */
export const useReminderSchedule = (): readonly [
  ReminderSchedule | null,
  (next: ReminderSchedule) => void
] => {
  const translate = useTranslate()
  const [schedule, setSchedule] = useState<ReminderSchedule | null>(null)

  useEffect(() => {
    let isCurrent = true
    void readReminderSchedule().then((read) => {
      if (isCurrent) setSchedule(read)
    })
    return () => {
      isCurrent = false
    }
  }, [])

  const keep = (next: ReminderSchedule) => {
    setSchedule(next)
    void saveReminderSchedule({
      copy: reminderCopyOf(translate),
      now: Temporal.Now.zonedDateTimeISO(),
      schedule: next
    })
  }

  return [schedule, keep] as const
}
