import type React from 'react'

import { ChartScrubber } from './chart-scrubber'
import { ChartTooltip } from './chart-tooltip'
import { nearestIndex, useChartCursor } from './use-chart-cursor'
import { hugBand } from './value-band'

import './line-chart.sass'

const W = 640
const H = 246
const PAD = 9

export type LinePoint = {
  /** Unique along the line: the day of the reading. */
  readonly key: string
  readonly time: number
  readonly value: number
}

type LineChartProps = {
  /** What the line measures, read by a screen reader before the summary. */
  caption: string
  /** One sentence that says the whole line: first and last reading. */
  summary: string
  points: readonly LinePoint[]
  /** A value as the slip prints it: `93.5 cm`. */
  formatValue: (value: number) => string
  /** A tick on the axis: the number alone. */
  formatTick: (value: number) => string
  formatKey: (key: string) => string
  /** The narrowest band the axis may show, in the line's unit. */
  minimumSpan: number
}

/**
 * One series over time. No text inside the SVG — the viewBox would rescale it
 * and lose the tabular figures — so the axis, the dates and the slip are HTML
 * laid over it. The last reading is the one in cinnabar.
 */
export const LineChart: React.FC<LineChartProps> = ({
  caption,
  formatKey,
  formatTick,
  formatValue,
  minimumSpan,
  points,
  summary
}) => {
  const cursor = useChartCursor()
  const first = points[0]
  const last = points.at(-1)
  if (first === undefined || last === undefined) return null

  const band = hugBand(
    points.map((point) => point.value),
    minimumSpan
  )
  const span = last.time - first.time
  const x = (point: LinePoint) =>
    PAD + (span === 0 ? 0.5 : (point.time - first.time) / span) * (W - 2 * PAD)
  const y = (value: number) =>
    PAD + (1 - (value - band.lo) / (band.hi - band.lo)) * (H - 2 * PAD)

  const ticks = [band.hi, (band.hi + band.lo) / 2, band.lo]
  const path = points.map((point) => `${x(point)},${y(point.value)}`).join(' ')
  const positions = points.map((point) => x(point) / W)
  const activePoint = cursor.active === null ? undefined : points[cursor.active]

  return (
    <figure className='line-chart'>
      <div className='chart'>
        <div aria-hidden='true' className='axis'>
          {ticks.map((value) => (
            <span
              key={value}
              style={{ '--tick-top': `${(y(value) / H) * 100}%` }}
            >
              {formatTick(value)}
            </span>
          ))}
        </div>

        <div
          className='plot-area'
          onPointerLeave={() => cursor.setActive(null)}
          onPointerMove={(event) =>
            cursor.setActive(nearestIndex({ event, positions }))
          }
        >
          <ChartScrubber
            active={cursor.active}
            count={points.length}
            label={`${caption}. ${summary}`}
            onActive={cursor.setActive}
            readoutAt={(index) => {
              const point = points[index]
              return point === undefined
                ? ''
                : `${formatKey(point.key)}: ${formatValue(point.value)}`
            }}
          />
          <svg aria-hidden='true' className='plot' viewBox={`0 0 ${W} ${H}`}>
            {ticks.map((value) => (
              <line
                className='gridline'
                key={value}
                vectorEffect='non-scaling-stroke'
                x1={0}
                x2={W}
                y1={y(value)}
                y2={y(value)}
              />
            ))}

            {activePoint !== undefined && (
              <line
                className='crosshair'
                vectorEffect='non-scaling-stroke'
                x1={x(activePoint)}
                x2={x(activePoint)}
                y1={0}
                y2={H}
              />
            )}

            {points.length > 1 && (
              <polyline
                className='line'
                points={path}
                vectorEffect='non-scaling-stroke'
              />
            )}

            {points.map((point) => (
              <circle
                className='dot'
                cx={x(point)}
                cy={y(point.value)}
                data-active={point === activePoint}
                data-last={point === last}
                key={point.key}
                r={point === activePoint ? 6.5 : 4.5}
                vectorEffect='non-scaling-stroke'
              />
            ))}
          </svg>

          {activePoint !== undefined && (
            <ChartTooltip
              across={x(activePoint) / W}
              down={y(activePoint.value) / H}
              label={formatKey(activePoint.key)}
              value={formatValue(activePoint.value)}
            />
          )}
        </div>
      </div>

      <figcaption aria-hidden='true' className='dates'>
        <span>{formatKey(first.key)}</span>
        {points.length > 1 && <span>{formatKey(last.key)}</span>}
      </figcaption>
    </figure>
  )
}
