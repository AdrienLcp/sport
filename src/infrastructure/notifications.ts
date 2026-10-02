import { Result } from '@adrienlcp/result'

export type NotificationPermissionState = NotificationPermission | 'unsupported'

export const notificationPermission = (): NotificationPermissionState =>
  'Notification' in window ? Notification.permission : 'unsupported'

/** Asks once; a browser that already answered answers again without asking. */
export const requestNotificationPermission = async (): Promise<
  Result<void, 'denied' | 'unsupported'>
> => {
  if (!('Notification' in window)) return Result.failure('unsupported')
  try {
    const answer = await Notification.requestPermission()
    return answer === 'granted' ? Result.success() : Result.failure('denied')
  } catch {
    return Result.failure('denied')
  }
}

/** The service worker, once it controls the page; `null` in a browser without one. */
const readyRegistration =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (!('serviceWorker' in navigator)) return null
    const waited = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<null>((resolve) => {
        window.setTimeout(() => resolve(null), 3000)
      })
    ])
    return waited
  }

export type NotificationContent = {
  readonly title: string
  readonly body: string
  /** One notification per tag: a second with the same tag replaces the first. */
  readonly tag: string
  /** No system sound. */
  readonly isSilent: boolean
}

const ICON = '/icons/icon-192.png'
const BADGE = '/icons/badge-96.png'

/**
 * Through the service worker, which is what Android requires and what lets a
 * click reopen the app; the page's own `Notification` only where no worker
 * runs, as in the dev server.
 */
export const showNotification = async (
  content: NotificationContent
): Promise<Result<void, 'denied' | 'failed' | 'unsupported'>> => {
  const permission = notificationPermission()
  if (permission === 'unsupported') return Result.failure('unsupported')
  if (permission !== 'granted') return Result.failure('denied')

  const options: NotificationOptions = {
    badge: BADGE,
    body: content.body,
    icon: ICON,
    silent: content.isSilent,
    tag: content.tag
  }

  try {
    const registration = await readyRegistration()
    if (registration === null) {
      new Notification(content.title, options)
    } else {
      await registration.showNotification(content.title, options)
    }
    return Result.success()
  } catch {
    return Result.failure('failed')
  }
}

/** What this browser offers to wake a closed app at a given time. */
export type WakeCapabilities = {
  /** Notification Triggers: scheduled ahead, shown with the app closed. */
  readonly canScheduleAhead: boolean
  /** Periodic Background Sync: the browser wakes an installed app a few times a day. */
  readonly canWakePeriodically: boolean
}

export const wakeCapabilities = (): WakeCapabilities => ({
  canScheduleAhead:
    'Notification' in window &&
    'showTrigger' in Notification.prototype &&
    'TimestampTrigger' in window,
  canWakePeriodically:
    'serviceWorker' in navigator &&
    'ServiceWorkerRegistration' in window &&
    'periodicSync' in ServiceWorkerRegistration.prototype
})

const REMINDER_WAKE = 'reminder'

/** Chrome grants the permission to installed apps only, and picks the rhythm itself. */
const MIN_WAKE_INTERVAL = 60 * 60 * 1000

export const startPeriodicWake = async (): Promise<
  Result<void, 'refused' | 'unsupported'>
> => {
  const registration = await readyRegistration()
  const periodicSync = registration?.periodicSync
  if (periodicSync === undefined) return Result.failure('unsupported')
  try {
    await periodicSync.register(REMINDER_WAKE, {
      minInterval: MIN_WAKE_INTERVAL
    })
    return Result.success()
  } catch {
    return Result.failure('refused')
  }
}

/** Nothing registered is the state asked for, so a refusal here is no failure. */
export const stopPeriodicWake = async (): Promise<void> => {
  const registration = await readyRegistration()
  await registration?.periodicSync
    ?.unregister(REMINDER_WAKE)
    .catch(() => undefined)
}

const SCHEDULED_TAG_PREFIX = 'reminder-'

/**
 * Hands the browser every reminder of the coming days at once, where it can
 * show them with the app closed. The previous batch goes first, or a changed
 * time would ring twice.
 */
export const scheduleAhead = async ({
  content,
  moments
}: {
  content: Omit<NotificationContent, 'tag'>
  moments: readonly Temporal.ZonedDateTime[]
}): Promise<Result<void, 'failed' | 'unsupported'>> => {
  if (!wakeCapabilities().canScheduleAhead) {
    return Result.failure('unsupported')
  }
  const registration = await readyRegistration()
  if (registration === null) return Result.failure('unsupported')
  try {
    const pending = await registration.getNotifications({
      includeTriggered: true
    })
    for (const notification of pending) {
      if (notification.tag.startsWith(SCHEDULED_TAG_PREFIX)) {
        notification.close()
      }
    }
    for (const moment of moments) {
      await registration.showNotification(content.title, {
        badge: BADGE,
        body: content.body,
        icon: ICON,
        showTrigger: new TimestampTrigger(moment.epochMilliseconds),
        silent: content.isSilent,
        tag: `${SCHEDULED_TAG_PREFIX}${moment.epochMilliseconds}`
      })
    }
    return Result.success()
  } catch {
    return Result.failure('failed')
  }
}
