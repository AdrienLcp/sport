import { isRecord } from '../../helpers/records'

/** 0 is Sunday, as `Date#getDay` counts; the plate prints Monday first. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

/** Monday first, the way a training week reads. */
export const WEEKDAYS_FROM_MONDAY: readonly Weekday[] = [1, 2, 3, 4, 5, 6, 0]

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
  value >= 0 &&
  value <= 6

/** Tolerant, like every stored shape here: what cannot be read is the default. */
export const parseSchedule = (value: unknown): ReminderSchedule => {
  if (!isRecord(value)) return DEFAULT_SCHEDULE
  const days = Array.isArray(value.days) ? value.days.filter(isWeekday) : []
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

const reminderOn = (date: Date, time: string): Date => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number)
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes
  )
}

/**
 * Every reminder strictly after `from`, over the next `days` days — what a
 * browser able to schedule notifications ahead is handed at once.
 */
export const remindersAfter = ({
  days,
  from,
  schedule
}: {
  days: number
  from: Date
  schedule: ReminderSchedule
}): readonly Date[] => {
  if (!schedule.isEnabled || schedule.days.length === 0) return []
  return Array.from({ length: days + 1 }, (_, offset) =>
    reminderOn(
      new Date(from.getFullYear(), from.getMonth(), from.getDate() + offset),
      schedule.time
    )
  ).filter(
    (moment) =>
      moment.getTime() > from.getTime() &&
      schedule.days.some((day) => day === moment.getDay())
  )
}

/** The next reminder after `from`, `null` when none is set. A week always holds one. */
export const nextReminder = (
  schedule: ReminderSchedule,
  from: Date
): Date | null => remindersAfter({ days: 7, from, schedule })[0] ?? null

/**
 * Whether a wake-up at `now` owes the reader today's reminder: today is one of
 * the days, the time has come, it was not shown yet, and no session was
 * already run today — a reminder after the fact is noise.
 */
export const isReminderOwed = ({
  lastSessionDay,
  lastShownDay,
  now,
  schedule,
  today
}: {
  lastSessionDay: string | null
  lastShownDay: string | null
  now: Date
  schedule: ReminderSchedule
  today: string
}): boolean =>
  schedule.isEnabled &&
  schedule.days.some((day) => day === now.getDay()) &&
  now.getTime() >= reminderOn(now, schedule.time).getTime() &&
  lastShownDay !== today &&
  lastSessionDay !== today
