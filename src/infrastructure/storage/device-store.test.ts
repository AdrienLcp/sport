import 'fake-indexeddb/auto'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { readDeviceValue, writeDeviceValue } from './device-store'

afterEach(() => {
  vi.restoreAllMocks()
})

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

  it('[device-store] aborting during the write rolls its transaction back', async () => {
    const controller = new AbortController()
    const put = IDBObjectStore.prototype.put
    vi.spyOn(IDBObjectStore.prototype, 'put').mockImplementation(function (
      this: IDBObjectStore,
      ...args: Parameters<typeof put>
    ) {
      const request = put.apply(this, args)
      controller.abort()
      return request
    })

    expect(
      await writeDeviceValue('last-shown-day', '2026-10-02', controller.signal)
    ).toEqual({ error: 'aborted', status: 'failure' })
    vi.restoreAllMocks()
    expect(await readDeviceValue('last-shown-day')).toEqual({
      data: undefined,
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
