import { readReminderSchedule } from '@/features/reminders/reminder-device'
import { DEFAULT_SCHEDULE } from '@/features/reminders/reminder-schedule'
import { useRouteData } from '@/infrastructure/router/navigation'

/**
 * Read before the page renders, so the reminder controls are drawn at once
 * instead of popping in when IndexedDB answers. A read only fails when the
 * router aborted it, and then the router throws away what comes back.
 */
export const settingsLoader = async ({ signal }: { signal: AbortSignal }) => {
  const read = await readReminderSchedule(signal)

  return {
    reminderSchedule: read.status === 'success' ? read.data : DEFAULT_SCHEDULE
  }
}

export const useSettingsData = () => useRouteData<typeof settingsLoader>()
