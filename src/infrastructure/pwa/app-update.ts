import { registerSW } from 'virtual:pwa-register'
import { useSyncExternalStore } from 'react'

/**
 * The service worker's life seen from the page: a new printing waiting, and
 * the one moment the reader accepts it. Never applied behind their back — a
 * reload in the middle of a set would lose the plate on screen.
 */
type UpdateState = {
  readonly isUpdateWaiting: boolean
  readonly isOfflineReady: boolean
}

let state: UpdateState = { isOfflineReady: false, isUpdateWaiting: false }
let applyWaiting: ((reloadPage?: boolean) => Promise<void>) | null = null
const listeners = new Set<() => void>()

const setState = (next: Partial<UpdateState>) => {
  state = { ...state, ...next }
  for (const listener of listeners) listener()
}

/** An open tab looks for a new printing every hour, not only on the next load. */
const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000

export const startServiceWorker = (): void => {
  if (!('serviceWorker' in navigator)) return
  applyWaiting = registerSW({
    onNeedRefresh: () => setState({ isUpdateWaiting: true }),
    onOfflineReady: () => setState({ isOfflineReady: true }),
    onRegisteredSW: (_url, registration) => {
      if (registration === undefined) return
      if (registration.active !== null) setState({ isOfflineReady: true })
      window.setInterval(() => {
        void registration.update().catch(() => undefined)
      }, UPDATE_CHECK_INTERVAL)
    }
  })
}

/**
 * Swaps in the waiting worker and reloads onto it. The reload is ours rather
 * than Workbox's: Workbox only reloads a page that was already controlled when
 * it registered, and a first visit claimed mid-way would stay on the old
 * printing with its slip still showing.
 */
export const applyUpdate = (): void => {
  navigator.serviceWorker.addEventListener(
    'controllerchange',
    () => window.location.reload(),
    { once: true }
  )
  void applyWaiting?.(true)
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const useAppUpdate = (): UpdateState =>
  useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  )
