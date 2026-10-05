import { Result } from '@adrienlcp/result'

import { warnOnFailure } from '@/infrastructure/diagnostics'
import {
  type NotificationContent,
  scheduleAhead,
  showNotification,
  startPeriodicWake,
  stopPeriodicWake,
  wakeCapabilities
} from '@/infrastructure/notifications'
import {
  readDeviceValue,
  writeDeviceValue
} from '@/infrastructure/storage/device-store'

import {
  DEFAULT_SCHEDULE,
  isReminderOwed,
  parseSchedule,
  type ReminderSchedule,
  remindersAfter
} from './reminder-schedule'

/** The words a reminder carries, in the reader's language at the time it was set. */
export type ReminderCopy = {
  readonly title: string
  readonly body: string
}

/** How far ahead a browser able to schedule notifications is handed them. */
const SCHEDULE_AHEAD_DAYS = 14

/**
 * A schedule this device cannot read is the default one: off. `'aborted'`
 * only when `signal` was, and then nothing is logged.
 */
export const readReminderSchedule = async (
  signal?: AbortSignal
): Promise<Result<ReminderSchedule, 'aborted'>> => {
  const read = await readDeviceValue('reminder-schedule', signal)
  if (signal?.aborted) return Result.failure('aborted')
  warnOnFailure(read, 'The reminder schedule could not be read')
  if (read.status === 'failure' || read.data === undefined) {
    return Result.success(DEFAULT_SCHEDULE)
  }
  return Result.success(parseSchedule(read.data))
}

/**
 * Keeps the schedule where the service worker reads it, then arms every way
 * this browser has of keeping it with the app closed: notifications handed
 * over ahead of time where they can be, a periodic wake where it is granted.
 */
export const saveReminderSchedule = async ({
  copy,
  now,
  schedule,
  signal
}: {
  copy: ReminderCopy
  now: Temporal.ZonedDateTime
  schedule: ReminderSchedule
  /** Aborted by a newer save: this one stops at its next step, silently. */
  signal: AbortSignal
}): Promise<void> => {
  const savedSchedule = await writeDeviceValue(
    'reminder-schedule',
    schedule,
    signal
  )
  if (signal.aborted) return
  warnOnFailure(savedSchedule, 'The reminder schedule could not be saved')

  const savedCopy = await writeDeviceValue('reminder-copy', copy, signal)
  if (signal.aborted) return
  warnOnFailure(savedCopy, 'The reminder text could not be saved')

  const capabilities = wakeCapabilities()
  if (capabilities.canScheduleAhead) {
    const scheduled = await scheduleAhead({
      content: { ...copy, isSilent: !schedule.withSound },
      moments: remindersAfter({
        days: SCHEDULE_AHEAD_DAYS,
        from: now,
        schedule
      }),
      signal
    })
    if (signal.aborted) return
    warnOnFailure(scheduled, 'The reminders could not be scheduled ahead')
  }
  if (!capabilities.canWakePeriodically) return
  if (!schedule.isEnabled) {
    await stopPeriodicWake(signal)
    return
  }
  const woken = await startPeriodicWake(signal)
  if (signal.aborted) return
  warnOnFailure(woken, 'The periodic wake could not be started')
}

/** A reminder after the session already ran is noise: the worker checks this day. */
export const noteSessionRun = async (day: string): Promise<void> => {
  warnOnFailure(
    await writeDeviceValue('last-session-day', day),
    'The session day could not be noted for the reminders'
  )
}

const dayOrNull = (value: unknown): string | null =>
  typeof value === 'string' ? value : null

const isOwedAt = async ({
  now,
  schedule
}: {
  now: Temporal.ZonedDateTime
  schedule: ReminderSchedule
}): Promise<boolean> => {
  const lastShown = await readDeviceValue('last-shown-day')
  const lastSession = await readDeviceValue('last-session-day')
  return isReminderOwed({
    lastSessionDay:
      lastSession.status === 'success' ? dayOrNull(lastSession.data) : null,
    lastShownDay:
      lastShown.status === 'success' ? dayOrNull(lastShown.data) : null,
    now,
    schedule
  })
}

const noteShown = async (now: Temporal.ZonedDateTime): Promise<void> => {
  warnOnFailure(
    await writeDeviceValue('last-shown-day', now.toPlainDate().toString()),
    'The reminder could not be noted as shown'
  )
}

/**
 * Opening the app after today's reminder time is being reminded: nothing
 * rings later that day, from the page or from the worker.
 */
export const acknowledgeTodaysReminder = async (
  now: Temporal.ZonedDateTime
): Promise<void> => {
  const read = await readReminderSchedule()
  if (read.status === 'failure') return
  if (await isOwedAt({ now, schedule: read.data })) await noteShown(now)
}

/**
 * Shows today's reminder if it is owed, then notes it as shown, so the
 * worker waking later the same day stays quiet. The app calls it from its own
 * timer while it is open.
 */
export const remindIfOwed = async ({
  copy,
  now
}: {
  copy: ReminderCopy
  now: Temporal.ZonedDateTime
}): Promise<void> => {
  const read = await readReminderSchedule()
  if (read.status === 'failure') return
  const schedule = read.data
  if (!(await isOwedAt({ now, schedule }))) return

  const shown = await showNotification({
    ...copy,
    isSilent: !schedule.withSound,
    tag: 'reminder'
  })
  warnOnFailure(shown, 'The reminder could not be shown')
  if (shown.status === 'failure') return
  await noteShown(now)
}

export const sendTestNotification = (
  content: Omit<NotificationContent, 'tag'>
): ReturnType<typeof showNotification> =>
  showNotification({ ...content, tag: 'reminder-test' })
