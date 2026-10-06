import { scaleLinear } from 'd3-scale'
import { line } from 'd3-shape'

import type { ValueBand } from './value-band'

type Range = readonly [start: number, end: number]

/**
 * A band laid onto a stretch of the plot: `lo` lands on `start`, `hi` on
 * `end`. A band of zero width puts every value halfway.
 */
export const bandScale = (
  band: ValueBand,
  [start, end]: Range
): ((value: number) => number) =>
  scaleLinear().domain([band.lo, band.hi]).range([start, end])

/** The SVG path through the points, in their order, joined by straight runs. */
export const linePath = (
  points: readonly (readonly [x: number, y: number])[]
): string => line()(points.map(([x, y]) => [x, y])) ?? ''
