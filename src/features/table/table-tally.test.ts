import { describe, expect, it } from 'vitest'

import { weekKeyOf } from './table-tally'

describe('table tally', () => {
  it('[table] files a Sunday under the Friday that opened its weekend', () => {
    expect(weekKeyOf('2026-10-04')).toBe('2026-10-02')
  })

  it('[table] keeps a Friday as its own week, and a Thursday in the last one', () => {
    expect(weekKeyOf('2026-10-02')).toBe('2026-10-02')
    expect(weekKeyOf('2026-10-01')).toBe('2026-09-25')
  })
})
