import type React from 'react'

import './chart-tooltip.sass'

type ChartTooltipProps = {
  /** Where the mark sits across the plot, 0 to 1: past the middle, the slip opens to the left. */
  across: number
  /** Where it sits down the plot, 0 to 1 from the top. */
  down: number
  /** What is read first: the number. */
  value: string
  /** What it belongs to: the day, the week. */
  label: string
  /** A second line under the value, when the mark holds two numbers. */
  detail?: string
}

/**
 * A slip laid beside the mark, the way a note is pinned in a manual's margin:
 * the value leads, what it belongs to follows. It repeats what the table under
 * the chart already holds, so it enhances and never gates.
 */
export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  across,
  detail,
  down,
  label,
  value
}) => (
  <span
    aria-hidden='true'
    className='chart-tooltip'
    data-side={across > 0.6 ? 'left' : 'right'}
    style={{
      '--tooltip-across': `${across * 100}%`,
      '--tooltip-down': `${down * 100}%`
    }}
  >
    <b>{value}</b>
    {detail !== undefined && <span className='detail'>{detail}</span>}
    <span className='label'>{label}</span>
  </span>
)
