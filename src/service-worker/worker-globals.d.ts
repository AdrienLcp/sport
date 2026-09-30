/** Periodic Background Sync, which the WebWorker library does not describe yet. */
interface PeriodicSyncEvent extends ExtendableEvent {
  readonly tag: string
}

interface ServiceWorkerGlobalScopeEventMap {
  periodicsync: PeriodicSyncEvent
}
