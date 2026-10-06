/// <reference lib="webworker" />
// A worker may not import() on demand: the polyfill is bundled, and stands
// aside wherever the browser has a native Temporal.
import 'temporal-polyfill/global'

import { clientsClaim } from 'workbox-core'
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { z } from 'zod/mini'

import { parseSchedule } from '../features/reminders/reminder-schedule'
import { zonedNow } from '../infrastructure/clock'
import {
  readDeviceValue,
  writeDeviceValue
} from '../infrastructure/storage/device-store'
import { owedReminder } from './owed-reminder'

declare const self: ServiceWorkerGlobalScope

/*
 * The whole app shell — every script, stylesheet, font and icon of this build
 * — is cached at install, so a session runs with no network from the first
 * set to the last stretch. Every address is the same page: the router draws
 * it, offline included.
 */
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()
/* The first visit is served offline from the moment the worker activates, not
   from the next load. A new printing still waits for the reader's reload. */
clientsClaim()
registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')))

/** Sent by the page when the reader accepts a new printing. */
const skipWaitingMessageSchema = z.object({ type: z.literal('SKIP_WAITING') })

self.addEventListener('message', (event) => {
  if (skipWaitingMessageSchema.safeParse(event.data).success) {
    void self.skipWaiting()
  }
})

const valueOrNull = async (
  key: Parameters<typeof readDeviceValue>[0]
): Promise<unknown> => {
  const read = await readDeviceValue(key)
  return read.status === 'success' ? read.data : null
}

/**
 * Woken by the browser a few times a day (Periodic Background Sync, installed
 * apps in Chromium): if today's reminder is due and nobody has trained yet,
 * show it once.
 */
const remindIfOwed = async (): Promise<void> => {
  const now = zonedNow()
  const reminder = owedReminder({
    copy: await valueOrNull('reminder-copy'),
    lastSessionDay: await valueOrNull('last-session-day'),
    lastShownDay: await valueOrNull('last-shown-day'),
    now,
    schedule: parseSchedule(await valueOrNull('reminder-schedule'))
  })
  if (reminder === null) return

  await self.registration.showNotification(reminder.title, {
    badge: '/icons/badge-96.png',
    body: reminder.body,
    icon: '/icons/icon-192.png',
    silent: reminder.isSilent,
    tag: 'reminder'
  })
  await writeDeviceValue('last-shown-day', now.toPlainDate().toString())
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'reminder') event.waitUntil(remindIfOwed())
})

/** A tap on a reminder brings the app forward, or opens it. */
const openApp = async (): Promise<void> => {
  const windows = await self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window'
  })
  const open = windows[0]
  if (open !== undefined) {
    await open.focus()
    return
  }
  await self.clients.openWindow('/')
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(openApp())
})
