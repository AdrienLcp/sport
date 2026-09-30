export type ValueBand = {
  readonly lo: number
  readonly hi: number
}

/**
 * A waist goes from 94 to 88 over a block: on a zero-based axis that is a flat
 * line. The band hugs the readings instead, and both bounds are printed beside
 * it so the zoom is stated rather than hidden.
 */
export const hugBand = (
  values: readonly number[],
  minimumSpan: number
): ValueBand => {
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (max - min < minimumSpan) {
    const mid = (min + max) / 2
    return { hi: mid + minimumSpan / 2, lo: mid - minimumSpan / 2 }
  }
  const pad = (max - min) * 0.22
  return { hi: max + pad, lo: min - pad }
}

/** A zero-based band whose top is a round number at or above every value. */
export const zeroBand = (
  values: readonly number[],
  floor: number
): ValueBand => {
  const max = Math.max(floor, ...values)
  const step = 10 ** Math.floor(Math.log10(max)) / 2
  return { hi: Math.ceil(max / step) * step, lo: 0 }
}
