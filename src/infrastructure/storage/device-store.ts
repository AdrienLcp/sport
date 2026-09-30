import { Result } from '@adrienlcp/result'

/*
 * A small key-value shelf in IndexedDB, for what the service worker must read
 * while no page is open: localStorage does not exist in a worker. Imported by
 * the app and by the worker alike, so it imports nothing through `@/`.
 */

const DATABASE = 'seance'
const SHELF = 'device'

/** Everything the worker reads, named once. */
export type DeviceKey =
  | 'last-session-day'
  | 'last-shown-day'
  | 'reminder-copy'
  | 'reminder-schedule'

const openDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(SHELF)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const settle = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

/** `undefined` when nothing was ever written under the key. */
export const readDeviceValue = async (
  key: DeviceKey
): Promise<Result<unknown, 'unavailable'>> => {
  try {
    const database = await openDatabase()
    const value: unknown = await settle(
      database.transaction(SHELF, 'readonly').objectStore(SHELF).get(key)
    )
    database.close()
    return Result.success(value)
  } catch {
    return Result.failure('unavailable')
  }
}

export const writeDeviceValue = async (
  key: DeviceKey,
  value: unknown
): Promise<Result<void, 'unavailable'>> => {
  try {
    const database = await openDatabase()
    await settle(
      database
        .transaction(SHELF, 'readwrite')
        .objectStore(SHELF)
        .put(value, key)
    )
    database.close()
    return Result.success()
  } catch {
    return Result.failure('unavailable')
  }
}
