import 'fake-indexeddb/auto'

import { describe, expect, it } from 'vitest'

import { readDeviceValue, writeDeviceValue } from './device-store'

describe('device store', () => {
  it('[device-store] a write aborted before it starts stores nothing', async () => {
    const controller = new AbortController()
    controller.abort()

    expect(
      await writeDeviceValue(
        'last-session-day',
        '2026-10-01',
        controller.signal
      )
    ).toEqual({ error: 'aborted', status: 'failure' })
    expect(await readDeviceValue('last-session-day')).toEqual({
      data: undefined,
      status: 'success'
    })
  })

  it('[device-store] the newer of two writes in flight has the last word', async () => {
    await Promise.all([
      writeDeviceValue('last-shown-day', '2026-10-01'),
      writeDeviceValue('last-shown-day', '2026-10-02')
    ])

    expect(await readDeviceValue('last-shown-day')).toEqual({
      data: '2026-10-02',
      status: 'success'
    })
  })

  it('[device-store] reads what an earlier build wrote in the same database', async () => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('seance', 1)
      request.onupgradeneeded = () => {
        request.result.createObjectStore('device')
      }
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const transaction = request.result.transaction('device', 'readwrite')
        transaction.objectStore('device').put('2026-09-30', 'last-session-day')
        transaction.oncomplete = () => {
          request.result.close()
          resolve()
        }
      }
    })

    expect(await readDeviceValue('last-session-day')).toEqual({
      data: '2026-09-30',
      status: 'success'
    })
  })

  it('[device-store] a read aborted on the way answers aborted, not the value', async () => {
    await writeDeviceValue('reminder-copy', { body: 'b', title: 't' })
    const controller = new AbortController()

    const read = readDeviceValue('reminder-copy', controller.signal)
    controller.abort()

    expect(await read).toEqual({ error: 'aborted', status: 'failure' })
  })
})
