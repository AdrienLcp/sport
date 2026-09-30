import { dayTime } from '@/helpers/days'

import type { Measure } from './training-log'

export type Point = {
  readonly day: string
  readonly value: number
  readonly time: number
}

const pointsOf = (
  measures: readonly Measure[],
  key: 'waist' | 'weight'
): readonly Point[] =>
  measures
    .flatMap((measure) => {
      const value = measure[key]
      return value === undefined
        ? []
        : [{ day: measure.day, time: dayTime(measure.day), value }]
    })
    .toSorted((a, b) => a.time - b.time)

export const waistPoints = (measures: readonly Measure[]): readonly Point[] =>
  pointsOf(measures, 'waist')

export const weightPoints = (measures: readonly Measure[]): readonly Point[] =>
  pointsOf(measures, 'weight')

/** Signed change from the first reading to the last. Down is the point. */
export const drift = (points: readonly Point[]): number | undefined => {
  const first = points[0]
  const last = points.at(-1)
  if (points.length < 2 || first === undefined || last === undefined) {
    return undefined
  }
  return last.value - first.value
}
