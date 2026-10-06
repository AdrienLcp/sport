import {
  isReminderOwed,
  type ReminderSchedule,
  reminderCopySchema,
  storedDayOrNull
} from '../features/reminders/reminder-schedule'

export type OwedReminder = {
  readonly title: string
  readonly body: string
  readonly isSilent: boolean
}

/**
 * What the worker shows when it wakes, or `null`. The words come from the page
 * — it wrote them in the reader's language when the schedule was saved — since
 * a worker has no dictionary of its own.
 */
export const owedReminder = ({
  copy,
  lastSessionDay,
  lastShownDay,
  now,
  schedule
}: {
  copy: unknown
  lastSessionDay: unknown
  lastShownDay: unknown
  now: Temporal.ZonedDateTime
  schedule: ReminderSchedule
}): OwedReminder | null => {
  const words = reminderCopySchema.safeParse(copy)
  if (!words.success) return null
  const isOwed = isReminderOwed({
    lastSessionDay: storedDayOrNull(lastSessionDay),
    lastShownDay: storedDayOrNull(lastShownDay),
    now,
    schedule
  })
  return isOwed
    ? {
        body: words.data.body,
        isSilent: !schedule.withSound,
        title: words.data.title
      }
    : null
}
