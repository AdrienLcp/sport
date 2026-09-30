import type React from 'react'

import { ChartScrubber } from './chart-scrubber'
import { ChartTooltip } from './chart-tooltip'
import { useChartCursor } from './use-chart-cursor'

import './day-grid.sass'

/** A day as the grid inks it: filled, outlined, a faint tick, or not yet. */
export type DayMark = 'empty' | 'future' | 'hollow' | 'solid'

export type GridDay = {
  readonly key: string
  readonly mark: DayMark
  /** What the slip says about the day: « Session run », « Rest ». */
  readonly readout: string
}

type DayGridProps = {
  caption: string
  summary: string
  /** Monday first, week after week: seven per column. */
  days: readonly GridDay[]
  /** The seven row labels, Monday first, each keyed by the day it names. */
  weekdays: readonly { readonly key: string; readonly label: string }[]
  formatKey: (key: string) => string
}

const ROWS = 7

/**
 * Weeks as columns, weekdays as rows: the register of which evenings were
 * trained. Rest days are printed as the faint tick they are, not as gaps —
 * the programme asks for them.
 */
export const DayGrid: React.FC<DayGridProps> = ({
  caption,
  days,
  formatKey,
  summary,
  weekdays
}) => {
  const cursor = useChartCursor()
  const weeks = Math.ceil(days.length / ROWS)
  const activeDay = cursor.active === null ? undefined : days[cursor.active]

  return (
    <figure className='day-grid'>
      <div className='chart' style={{ '--grid-weeks': weeks }}>
        <div aria-hidden='true' className='weekdays'>
          {weekdays.map((weekday) => (
            <span key={weekday.key}>{weekday.label}</span>
          ))}
        </div>

        <div
          className='plot-area'
          onPointerLeave={() => cursor.setActive(null)}
          onPointerMove={(event) => {
            const box = event.currentTarget.getBoundingClientRect()
            const week = Math.floor(
              ((event.clientX - box.left) / box.width) * weeks
            )
            const row = Math.floor(
              ((event.clientY - box.top) / box.height) * ROWS
            )
            const index = week * ROWS + row
            cursor.setActive(index >= 0 && index < days.length ? index : null)
          }}
        >
          <ChartScrubber
            active={cursor.active}
            count={days.length}
            label={`${caption}. ${summary}`}
            onActive={cursor.setActive}
            readoutAt={(index) => {
              const day = days[index]
              return day === undefined
                ? ''
                : `${formatKey(day.key)}: ${day.readout}`
            }}
          />
          {days.map((day) => (
            <span
              aria-hidden='true'
              className='cell'
              data-active={day === activeDay}
              data-mark={day.mark}
              key={day.key}
            />
          ))}

          {activeDay !== undefined && cursor.active !== null && (
            <ChartTooltip
              across={(Math.floor(cursor.active / ROWS) + 0.5) / weeks}
              down={((cursor.active % ROWS) + 0.5) / ROWS}
              label={formatKey(activeDay.key)}
              value={activeDay.readout}
            />
          )}
        </div>
      </div>
    </figure>
  )
}
