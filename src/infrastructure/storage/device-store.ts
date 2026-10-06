import { Result } from '@adrienlcp/result'
import { createStore, get, set, type UseStore } from 'idb-keyval'

/*
 * A small key-value shelf in IndexedDB, for what the service worker must read
 * while no page is open: localStorage does not exist in a worker. Imported by
 * the app and by the worker alike, so it imports nothing through `@/`.
 */

/** The names every device already holds: renaming either strands its reminders. */
const DATABASE = 'seance'
const SHELF = 'device'

/** Everything the worker reads, named once. */
export type DeviceKey =
  | 'last-session-day'
  | 'last-shown-day'
  | 'reminder-copy'
  | 'reminder-schedule'

/** `'aborted'` is the caller's own doing and is never shown or logged. */
export type DeviceStoreError = 'aborted' | 'unavailable'

let shelf: UseStore | undefined

/** Opened on first use: a browser without IndexedDB fails the call, not the import. */
const deviceShelf = (): UseStore => {
  shelf ??= createStore(DATABASE, SHELF)
  return shelf
}

/**
 * `undefined` when nothing was ever written under the key. A read whose
 * `signal` aborts on the way answers `'aborted'`, never the value.
 */
export const readDeviceValue = async (
  key: DeviceKey,
  signal?: AbortSignal
): Promise<Result<unknown, DeviceStoreError>> => {
  if (signal?.aborted) return Result.failure('aborted')
  try {
    const value: unknown = await get(key, deviceShelf())
    return signal?.aborted ? Result.failure('aborted') : Result.success(value)
  } catch {
    return Result.failure(signal?.aborted ? 'aborted' : 'unavailable')
  }
}

/**
 * A write whose `signal` aborted before it starts stores nothing. Writes land
 * in the order they were made, so a newer save always has the last word.
 */
export const writeDeviceValue = async (
  key: DeviceKey,
  value: unknown,
  signal?: AbortSignal
): Promise<Result<void, DeviceStoreError>> => {
  if (signal?.aborted) return Result.failure('aborted')
  try {
    await set(key, value, deviceShelf())
    return Result.success()
  } catch {
    return Result.failure('unavailable')
  }
}
