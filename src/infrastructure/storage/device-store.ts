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

/** `'aborted'` is the caller's own doing and is never shown or logged. */
export type DeviceStoreError = 'aborted' | 'unavailable'

const openDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(SHELF)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const completion = (transaction: IDBTransaction): Promise<void> =>
  new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onabort = () => reject(transaction.error)
    transaction.onerror = () => reject(transaction.error)
  })

/**
 * One transaction on the shelf. An abort of `signal` before it opens leaves
 * the shelf untouched; during it, it aborts the transaction, which rolls back.
 */
const onShelf = async <T>({
  mode,
  operate,
  signal
}: {
  mode: IDBTransactionMode
  operate: (shelf: IDBObjectStore) => IDBRequest<T>
  signal: AbortSignal | undefined
}): Promise<Result<T, DeviceStoreError>> => {
  if (signal?.aborted) return Result.failure('aborted')
  try {
    const database = await openDatabase()
    try {
      if (signal?.aborted) return Result.failure('aborted')
      const transaction = database.transaction(SHELF, mode)
      const abortTransaction = () => transaction.abort()
      signal?.addEventListener('abort', abortTransaction, { once: true })
      try {
        const request = operate(transaction.objectStore(SHELF))
        await completion(transaction)
        return Result.success(request.result)
      } finally {
        signal?.removeEventListener('abort', abortTransaction)
      }
    } finally {
      database.close()
    }
  } catch {
    return Result.failure(signal?.aborted ? 'aborted' : 'unavailable')
  }
}

/** `undefined` when nothing was ever written under the key. */
export const readDeviceValue = async (
  key: DeviceKey,
  signal?: AbortSignal
): Promise<Result<unknown, DeviceStoreError>> => {
  const read = await onShelf<unknown>({
    mode: 'readonly',
    operate: (shelf) => shelf.get(key),
    signal
  })
  if (read.status === 'success' && signal?.aborted) {
    return Result.failure('aborted')
  }
  return read
}

export const writeDeviceValue = async (
  key: DeviceKey,
  value: unknown,
  signal?: AbortSignal
): Promise<Result<void, DeviceStoreError>> => {
  const written = await onShelf({
    mode: 'readwrite',
    operate: (shelf) => shelf.put(value, key),
    signal
  })
  return written.status === 'success' ? Result.success() : written
}
