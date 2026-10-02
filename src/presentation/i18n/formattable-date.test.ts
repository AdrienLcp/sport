import { describe, expect, it } from 'vitest'

import { toFormattableDate } from './formattable-date'

describe('formattable date', () => {
  it('[i18n] hands a calendar day over as that same local day', () => {
    const date = toFormattableDate(Temporal.PlainDate.from('2026-10-25'))
    expect([date.getFullYear(), date.getMonth() + 1, date.getDate()]).toEqual([
      2026, 10, 25
    ])
  })

  it('[i18n] keeps the wall-clock minute of a date-time', () => {
    const date = toFormattableDate(
      Temporal.PlainDateTime.from('2026-10-02T21:05')
    )
    expect([date.getHours(), date.getMinutes()]).toEqual([21, 5])
  })
})
