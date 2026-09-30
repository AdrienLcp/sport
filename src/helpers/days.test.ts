import { describe, expect, it } from 'vitest'

import { addDays, isoDay, mondayOf } from './days'

describe('days', () => {
  it('[days] finds the Monday of a Sunday six days back, not the next one', () => {
    expect(mondayOf('2026-10-04')).toBe('2026-09-28')
  })

  it('[days] keeps a Monday as its own week start', () => {
    expect(mondayOf('2026-09-28')).toBe('2026-09-28')
  })

  it('[days] crosses a month and a daylight-saving change without drifting', () => {
    expect(addDays('2026-10-24', 3)).toBe('2026-10-27')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })

  it('[days] writes a local date as its calendar day', () => {
    expect(isoDay(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05')
  })
})
