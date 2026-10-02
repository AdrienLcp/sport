import { describe, expect, it } from 'vitest'

import { addDays } from '@/helpers/days'

import { makeSpecimen } from './specimen-data'

const today = '2026-09-29'

describe('specimen', () => {
  it('[specimen] prints the same specimen for the same day', () => {
    expect(makeSpecimen(today)).toEqual(makeSpecimen(today))
  })

  it('[specimen] holds twelve weeks of sessions, none in the future', () => {
    const { log } = makeSpecimen(today)
    const first = addDays(today, -12 * 7)
    expect(log.entries.length).toBeGreaterThan(20)
    for (const entry of log.entries) {
      expect(entry.day >= first && entry.day <= today).toBe(true)
    }
  })

  it('[specimen] turns the block weeks as A to E are run, one stopped session among them', () => {
    const { log } = makeSpecimen(today)
    expect(log.entries[0]?.sessionId).toBe('A')
    expect(log.entries[5]?.week).toBe(2)
    expect(log.entries.filter((entry) => entry.stopped === true)).toHaveLength(
      1
    )
  })

  it('[specimen] brings the waist down over the weeks', () => {
    const waists = (makeSpecimen(today).log.measures ?? []).map(
      (measure) => measure.waist ?? 0
    )
    expect(waists.length).toBeGreaterThanOrEqual(11)
    expect(waists.at(-1)).toBeLessThan(waists[0] ?? 0)
  })

  it('[specimen] counts the last fourteen days at the table', () => {
    expect(Object.keys(makeSpecimen(today).table.days)).toHaveLength(14)
  })
})
