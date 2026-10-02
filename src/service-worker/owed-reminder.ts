import {
  isReminderOwed,
  type ReminderSchedule
} from '../features/reminders/reminder-schedule'
import { isRecord } from '../helpers/records'

export type OwedReminder = {
  readonly title: string
  readonly body: string
  readonly isSilent: boolean
}

const asDay = (value: unknown): string | null =>
  typeof value === 'string' ? value : null

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
  if (
    !isRecord(copy) ||
    typeof copy.title !== 'string' ||
    typeof copy.body !== 'string'
  ) {
    return null
  }
  const isOwed = isReminderOwed({
    lastSessionDay: asDay(lastSessionDay),
    lastShownDay: asDay(lastShownDay),
    now,
    schedule
  })
  return isOwed
    ? { body: copy.body, isSilent: !schedule.withSound, title: copy.title }
    : null
}
