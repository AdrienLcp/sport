import type React from 'react'
import { useState } from 'react'

/**
 * The one mark a chart is pointing at, whichever hand points: the pointer
 * snaps to the nearest mark, the keyboard walks them through the scrubber, and
 * both land on the same index so hover and focus show the same readout.
 */
export const useChartCursor = () => {
  const [active, setActive] = useState<number | null>(null)
  return { active, setActive }
}

/** The index nearest the pointer, from its horizontal position over the plot. */
export const nearestIndex = ({
  event,
  positions
}: {
  event: React.PointerEvent<HTMLElement>
  /** Each mark's position across the plot, 0 to 1. */
  positions: readonly number[]
}): number | null => {
  if (positions.length === 0) return null
  const box = event.currentTarget.getBoundingClientRect()
  const at = (event.clientX - box.left) / box.width
  let best = 0
  positions.forEach((position, index) => {
    if (Math.abs(position - at) < Math.abs((positions[best] ?? 0) - at)) {
      best = index
    }
  })
  return best
}
