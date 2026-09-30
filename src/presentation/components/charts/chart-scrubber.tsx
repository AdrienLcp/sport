import type React from 'react'

import './chart-scrubber.sass'

type ChartScrubberProps = {
  active: number | null
  /** What the chart shows, then its whole summary: read when the scrubber takes focus. */
  label: string
  count: number
  onActive: (index: number | null) => void
  /** What the mark at `index` says, read out as the scrubber moves. */
  readoutAt: (index: number) => string
}

/**
 * A native range input laid invisibly over the plot. It is what a keyboard
 * and a screen reader walk the marks with — arrows, Home, End, each value read
 * out — and on a touch screen a finger dragged across the chart scrubs it.
 * The plot around it draws the ring when it has focus.
 */
export const ChartScrubber: React.FC<ChartScrubberProps> = ({
  active,
  count,
  label,
  onActive,
  readoutAt
}) => {
  const value = active ?? count - 1

  return (
    <input
      aria-label={label}
      aria-valuetext={readoutAt(value)}
      className='chart-scrubber'
      max={count - 1}
      min={0}
      onBlur={() => onActive(null)}
      onChange={(event) => onActive(Number(event.target.value))}
      onFocus={() => onActive(value)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onActive(null)
      }}
      step={1}
      type='range'
      value={value}
    />
  )
}
