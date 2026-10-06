import { afterEach, describe, expect, it } from 'vitest'

import { readTable } from './table-storage'
import { readTrainingLog } from './training-log-storage'

const store = new Map<string, string>()

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key: string) => store.get(key) ?? null,
    removeItem: (key: string) => store.delete(key),
    setItem: (key: string, value: string) => store.set(key, value)
  }
})

afterEach(() => {
  store.clear()
})

describe('stored shapes', () => {
  it('[storage] reads a table an older build wrote with no market and no days', () => {
    store.set('seance.table.v1', JSON.stringify({ days: null, version: 1 }))
    expect(readTable('own')).toEqual({
      data: { days: {}, market: { ticked: [], week: '' }, version: 1 },
      status: 'success'
    })
  })

  it('[storage] refuses a stored log whose sessions are not the app’s', () => {
    store.set(
      'seance.log.v1',
      JSON.stringify({ entries: [{ day: '2026-10-01' }], version: 1 })
    )
    expect(readTrainingLog('own')).toEqual({
      error: 'unrecognized',
      status: 'failure'
    })
  })

  it('[storage] reads nothing stored as the empty log', () => {
    expect(readTrainingLog('own')).toEqual({
      data: { entries: [], version: 1 },
      status: 'success'
    })
  })
})
