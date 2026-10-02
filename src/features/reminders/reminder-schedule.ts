import { isRecord } from '../../helpers/records'

/** 1 is Monday and 7 is Sunday, as `Temporal.PlainDate#dayOfWeek` counts. */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7

/** Monday first, the way a training week reads. */
export const WEEKDAYS_FROM_MONDAY: readonly Weekday[] = [1, 2, 3, 4, 5, 6, 7]

/** Schedules saved before the ISO count wrote Sunday as 0, as `Date#getDay` did. */
const LEGACY_SUNDAY = 0

export type ReminderSchedule = {
  readonly isEnabled: boolean
  readonly days: readonly Weekday[]
  /** `HH:MM`, 24-hour, in the device's own time zone. */
  readonly time: string
  /** The system's notification sound. Off unless asked for: the app is used
      in a quiet home at the end of the day. */
  readonly withSound: boolean
}

/** Five evenings, the five sessions of a turn; weekends left free. */
export const DEFAULT_SCHEDULE: ReminderSchedule = {
  days: [1, 2, 3, 4, 5],
  isEnabled: false,
  time: '19:30',
  withSound: false
}

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/

export const isReminderTime = (value: string): boolean =>
  TIME_PATTERN.test(value)

const isWeekday = (value: unknown): value is Weekday =>
  typeof value === 'number' &&
  Number.isInteger(value) &&
  value >= 1 &&
  value <= 7

const storedWeekdayOf = (value: unknown): readonly Weekday[] => {
  if (value === LEGACY_SUNDAY) return [7]
  return isWeekday(value) ? [value] : []
}

/** Tolerant, like every stored shape here: what cannot be read is the default. */
export const parseSchedule = (value: unknown): ReminderSchedule => {
  if (!isRecord(value)) return DEFAULT_SCHEDULE
  const days = Array.isArray(value.days)
    ? value.days.flatMap(storedWeekdayOf)
    : []
  return {
    days: [...new Set(days)].toSorted((a, b) => a - b),
    isEnabled: value.isEnabled === true,
    time:
      typeof value.time === 'string' && isReminderTime(value.time)
        ? value.time
        : DEFAULT_SCHEDULE.time,
    withSound: value.withSound === true
  }
}

export const toggleDay = (
  schedule: ReminderSchedule,
  day: Weekday
): ReminderSchedule => ({
  ...schedule,
  days: (schedule.days.includes(day)
    ? schedule.days.filter((current) => current !== day)
    : [...schedule.days, day]
  ).toSorted((a, b) => a - b)
})

/**
 * A time that falls in a daylight-saving gap rings at the same distance past
 * it (02:30 becomes 03:30); a time that happens twice rings the first time.
 */
const REMINDER_DISAMBIGUATION = 'compatible'

const reminderOn = (
  day: Temporal.PlainDate,
  time: string,
  timeZone: string
): Temporal.ZonedDateTime =>
  day
    .toPlainDateTime(Temporal.PlainTime.from(time))
    .toZonedDateTime(timeZone, { disambiguation: REMINDER_DISAMBIGUATION })

const isChosenDay = (schedule: ReminderSchedule, day: Temporal.PlainDate) =>
  schedule.days.some((chosen) => chosen === day.dayOfWeek)

/**
 * Every reminder strictly after `from`, over the next `days` days — what a
 * browser able to schedule notifications ahead is handed at once. Each one is
 * placed in `from`'s time zone, so a reminder set for 19:30 stays at 19:30
 * across a daylight-saving change.
 */
export const remindersAfter = ({
  days,
  from,
  schedule
}: {
  days: number
  from: Temporal.ZonedDateTime
  schedule: ReminderSchedule
}): readonly Temporal.ZonedDateTime[] => {
  if (!schedule.isEnabled || schedule.days.length === 0) return []
  const firstDay = from.toPlainDate()
  return Array.from({ length: days + 1 }, (_, offset) =>
    firstDay.add({ days: offset })
  )
    .filter((day) => isChosenDay(schedule, day))
    .map((day) => reminderOn(day, schedule.time, from.timeZoneId))
    .filter((moment) => Temporal.ZonedDateTime.compare(moment, from) > 0)
}

/** The next reminder after `from`, `null` when none is set. A week always holds one. */
export const nextReminder = (
  schedule: ReminderSchedule,
  from: Temporal.ZonedDateTime
): Temporal.ZonedDateTime | null =>
  remindersAfter({ days: 7, from, schedule })[0] ?? null

/**
 * Whether a wake-up at `now` owes the reader today's reminder: today is one of
 * the days, the time has come, it was not shown yet, and no session was
 * already run today — a reminder after the fact is noise.
 */
export const isReminderOwed = ({
  lastSessionDay,
  lastShownDay,
  now,
  schedule
}: {
  lastSessionDay: string | null
  lastShownDay: string | null
  now: Temporal.ZonedDateTime
  schedule: ReminderSchedule
}): boolean => {
  const today = now.toPlainDate()
  const day = today.toString()
  return (
    schedule.isEnabled &&
    isChosenDay(schedule, today) &&
    Temporal.ZonedDateTime.compare(
      now,
      reminderOn(today, schedule.time, now.timeZoneId)
    ) >= 0 &&
    lastShownDay !== day &&
    lastSessionDay !== day
  )
}
