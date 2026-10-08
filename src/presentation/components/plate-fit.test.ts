import { describe, expect, it } from 'vitest'

import { plateOverflows } from './plate-fit'

describe('plateOverflows', () => {
  it('fits when the body squeezes into what the fixed parts leave', () => {
    expect(
      plateOverflows({
        available: 800,
        bodies: [{ floor: 120, height: 480 }],
        contentHeight: 800
      })
    ).toBe(false)
  })

  it('overflows when the fixed parts and the body floor exceed the stage', () => {
    expect(
      plateOverflows({
        available: 422,
        bodies: [{ floor: 120, height: 120 }],
        contentHeight: 900
      })
    ).toBe(true)
  })

  it('gives the same answer for a body laid out at full length', () => {
    const squeezed = plateOverflows({
      available: 422,
      bodies: [{ floor: 120, height: 120 }],
      contentHeight: 900
    })
    const fullLength = plateOverflows({
      available: 422,
      bodies: [{ floor: 120, height: 1300 }],
      contentHeight: 2080
    })
    expect(fullLength).toBe(squeezed)
  })

  it('overflows a plate with no body once its content passes the stage', () => {
    expect(
      plateOverflows({ available: 422, bodies: [], contentHeight: 500 })
    ).toBe(true)
  })

  it('takes a sub-pixel rounding as a fit', () => {
    expect(
      plateOverflows({ available: 422, bodies: [], contentHeight: 422.6 })
    ).toBe(false)
  })
})
