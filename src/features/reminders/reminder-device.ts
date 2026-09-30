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

const warnOnFailure = (
  outcome: { status: 'failure'; error: string } | { status: 'success' },
  what: string
): void => {
  if (outcome.status === 'failure') console.warn(`${what} (${outcome.error}).`)
}

/** A schedule this device cannot read is the default one: off. */
export const readReminderSchedule = async (): Promise<ReminderSchedule> => {
  const read = await readDeviceValue('reminder-schedule')
  if (read.status === 'failure') {
    console.warn(`The reminder schedule could not be read (${read.error}).`)
    return DEFAULT_SCHEDULE
  }
  return read.data === undefined ? DEFAULT_SCHEDULE : parseSchedule(read.data)
}

/**
 * Keeps the schedule where the service worker reads it, then arms every way
 * this browser has of keeping it with the app closed: notifications handed
 * over ahead of time where they can be, a periodic wake where it is granted.
 */
export const saveReminderSchedule = async ({
  copy,
  now,
  schedule
}: {
  copy: ReminderCopy
  now: Date
  schedule: ReminderSchedule
}): Promise<void> => {
  warnOnFailure(
    await writeDeviceValue('reminder-schedule', schedule),
    'The reminder schedule could not be saved'
  )
  warnOnFailure(
    await writeDeviceValue('reminder-copy', copy),
    'The reminder text could not be saved'
  )

  const capabilities = wakeCapabilities()
  if (capabilities.canScheduleAhead) {
    warnOnFailure(
      await scheduleAhead({
        content: { ...copy, isSilent: !schedule.withSound },
        moments: remindersAfter({
          days: SCHEDULE_AHEAD_DAYS,
          from: now,
          schedule
        })
      }),
      'The reminders could not be scheduled ahead'
    )
  }
  if (!capabilities.canWakePeriodically) return
  if (schedule.isEnabled) {
    warnOnFailure(
      await startPeriodicWake(),
      'The periodic wake could not be started'
    )
  } else {
    await stopPeriodicWake()
  }
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
  schedule,
  today
}: {
  now: Date
  schedule: ReminderSchedule
  today: string
}): Promise<boolean> => {
  const lastShown = await readDeviceValue('last-shown-day')
  const lastSession = await readDeviceValue('last-session-day')
  return isReminderOwed({
    lastSessionDay:
      lastSession.status === 'success' ? dayOrNull(lastSession.data) : null,
    lastShownDay:
      lastShown.status === 'success' ? dayOrNull(lastShown.data) : null,
    now,
    schedule,
    today
  })
}

const noteShown = async (today: string): Promise<void> => {
  warnOnFailure(
    await writeDeviceValue('last-shown-day', today),
    'The reminder could not be noted as shown'
  )
}

/**
 * Opening the app after today's reminder time is being reminded: nothing
 * rings later that day, from the page or from the worker.
 */
export const acknowledgeTodaysReminder = async ({
  now,
  today
}: {
  now: Date
  today: string
}): Promise<void> => {
  const schedule = await readReminderSchedule()
  if (await isOwedAt({ now, schedule, today })) await noteShown(today)
}

/**
 * Shows today's reminder if it is owed, then notes it as shown, so the
 * worker waking later the same day stays quiet. The app calls it from its own
 * timer while it is open.
 */
export const remindIfOwed = async ({
  copy,
  now,
  today
}: {
  copy: ReminderCopy
  now: Date
  today: string
}): Promise<void> => {
  const schedule = await readReminderSchedule()
  if (!(await isOwedAt({ now, schedule, today }))) return

  const shown = await showNotification({
    ...copy,
    isSilent: !schedule.withSound,
    tag: 'reminder'
  })
  if (shown.status === 'failure') {
    console.warn(`The reminder could not be shown (${shown.error}).`)
    return
  }
  await noteShown(today)
}

export const sendTestNotification = (
  content: Omit<NotificationContent, 'tag'>
): ReturnType<typeof showNotification> =>
  showNotification({ ...content, tag: 'reminder-test' })
