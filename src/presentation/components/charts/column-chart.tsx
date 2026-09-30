import type React from 'react'

import { ChartScrubber } from './chart-scrubber'
import { ChartTooltip } from './chart-tooltip'
import { nearestIndex, useChartCursor } from './use-chart-cursor'
import type { ValueBand } from './value-band'

import './column-chart.sass'

/**
 * `solid` is inked; `hollow` is only its outline. A stack of the two tells its
 * parts apart by fill and not by hue, which the two inks of this world could
 * never do on their own.
 */
export type SegmentTone = 'hollow' | 'solid'

export type Column = {
  /** Unique along the chart: the week's Monday. */
  readonly key: string
  /** Bottom to top, one segment per tone. */
  readonly segments: readonly {
    readonly tone: SegmentTone
    readonly value: number
  }[]
  /** The slip's first line: the column's number. */
  readonly readout: string
  /** The slip's second line, when the column holds two numbers. */
  readonly detail?: string
}

type ColumnChartProps = {
  /** What the columns count, read by a screen reader before the summary. */
  caption: string
  summary: string
  columns: readonly Column[]
  band: ValueBand
  /** Values the axis prints and rules a hairline at. */
  ticks: readonly number[]
  formatTick: (value: number) => string
  /** A column's name in the slip and the readout: « Week of Sep 28 ». */
  formatKey: (key: string) => string
  /** The shorter name printed under the first and last columns. */
  formatEdgeKey: (key: string) => string
}

const totalOf = (column: Column): number =>
  column.segments.reduce((total, segment) => total + segment.value, 0)

/**
 * One column per week, the current one last and inked darker: it is the week
 * still being written. Columns are HTML rather than SVG, so a value never
 * rescales with the plot.
 */
export const ColumnChart: React.FC<ColumnChartProps> = ({
  band,
  caption,
  columns,
  formatEdgeKey,
  formatKey,
  formatTick,
  summary,
  ticks
}) => {
  const cursor = useChartCursor()
  const first = columns[0]
  const last = columns.at(-1)
  if (first === undefined || last === undefined) return null

  const heightOf = (value: number) =>
    ((value - band.lo) / (band.hi - band.lo)) * 100
  const positions = columns.map((_, index) => (index + 0.5) / columns.length)
  const activeColumn =
    cursor.active === null ? undefined : columns[cursor.active]

  return (
    <figure className='column-chart'>
      <div className='chart'>
        <div aria-hidden='true' className='axis'>
          {ticks.map((value) => (
            <span key={value} style={{ '--tick-up': `${heightOf(value)}%` }}>
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
            count={columns.length}
            label={`${caption}. ${summary}`}
            onActive={cursor.setActive}
            readoutAt={(index) => {
              const column = columns[index]
              return column === undefined
                ? ''
                : [formatKey(column.key), column.readout, column.detail]
                    .filter((part) => part !== undefined)
                    .join(', ')
            }}
          />
          {ticks.map((value) => (
            <i
              aria-hidden='true'
              className='gridline'
              key={value}
              style={{ '--tick-up': `${heightOf(value)}%` }}
            />
          ))}

          <div aria-hidden='true' className='column-slots'>
            {columns.map((column) => (
              <div
                className='slot'
                data-active={column === activeColumn}
                data-current={column === last}
                key={column.key}
              >
                <div className='stack'>
                  {column.segments.map((segment) =>
                    segment.value > 0 ? (
                      <span
                        className='segment'
                        data-tone={segment.tone}
                        key={segment.tone}
                        style={{
                          '--segment-height': `${heightOf(segment.value + band.lo)}%`
                        }}
                      />
                    ) : null
                  )}
                </div>
              </div>
            ))}
          </div>

          {activeColumn !== undefined && cursor.active !== null && (
            <ChartTooltip
              across={positions[cursor.active] ?? 0.5}
              detail={activeColumn.detail}
              down={1 - heightOf(totalOf(activeColumn)) / 100}
              label={formatKey(activeColumn.key)}
              value={activeColumn.readout}
            />
          )}
        </div>
      </div>

      <figcaption aria-hidden='true' className='dates'>
        <span>{formatEdgeKey(first.key)}</span>
        <span>{formatEdgeKey(last.key)}</span>
      </figcaption>
    </figure>
  )
}
