/*
 * Platform APIs the DOM library does not describe yet. Each is optional and
 * feature-detected where it is used: declaring it is what lets the detection
 * compile without a cast, never a promise that the browser has it.
 */

/** Chrome's install prompt, fired before the browser offers its own. */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: readonly string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  prompt: () => Promise<void>
}

interface WindowEventMap {
  beforeinstallprompt: BeforeInstallPromptEvent
}

/** Periodic Background Sync: Chromium, installed apps only. */
interface PeriodicSyncManager {
  register: (tag: string, options?: { minInterval?: number }) => Promise<void>
  unregister: (tag: string) => Promise<void>
  getTags: () => Promise<string[]>
}

interface ServiceWorkerRegistration {
  readonly periodicSync?: PeriodicSyncManager
}

/** Notification Triggers: an origin trial that never shipped; detected, not assumed. */
interface NotificationOptions {
  showTrigger?: TimestampTrigger
}

declare class TimestampTrigger {
  constructor(timestamp: number)
}

interface GetNotificationOptions {
  includeTriggered?: boolean
}

interface Navigator {
  /** Safari on iOS, opened from the home screen. */
  readonly standalone?: boolean
}
