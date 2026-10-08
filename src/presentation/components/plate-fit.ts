/** One `.body` of a plate, as laid out right now. */
export type BodyBox = {
  /** Its current height, padding included. */
  readonly height: number
  /** Its `min-height`: the smallest window it may scroll inside. */
  readonly floor: number
}

type PlateMeasure = {
  /** The plate's whole content height, overflow included. */
  readonly contentHeight: number
  readonly bodies: readonly BodyBox[]
  /** The height the stage gives the plate. */
  readonly available: number
}

/** Sub-pixel layout rounds both ways; a pixel either side is a fit. */
const ROUNDING_SLACK = 1

/**
 * Whether a plate fits only by scrolling as a whole. It fits when what never
 * shrinks — the head band, the legend, the action, the exits — plus each
 * body squeezed to its floor still fits the stage. The answer is the same
 * whether the bodies are squeezed or laid out at full length, so switching
 * between the two never flips it back.
 */
export const plateOverflows = ({
  available,
  bodies,
  contentHeight
}: PlateMeasure): boolean => {
  const fixedHeight = bodies.reduce(
    (height, body) => height - body.height,
    contentHeight
  )
  const leastHeight = bodies.reduce(
    (height, body) => height + body.floor,
    fixedHeight
  )
  return leastHeight > available + ROUNDING_SLACK
}

const measure = (plate: HTMLElement): PlateMeasure => ({
  available: plate.parentElement?.clientHeight ?? plate.clientHeight,
  bodies: Array.from(plate.querySelectorAll<HTMLElement>('.body'), (body) => ({
    floor: Number.parseFloat(getComputedStyle(body).minHeight) || 0,
    height: body.offsetHeight
  })),
  contentHeight: plate.scrollHeight
})

/**
 * Marks the plate `data-overflowing` while it cannot fit its stage — a page
 * zoomed to 200 %, a phone on its side — so it scrolls as one page instead of
 * pushing its action and exits out of the frame. Returns the cleanup.
 */
export const observePlateFit = (plate: HTMLElement): (() => void) => {
  let frame = 0

  const update = (): void => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      plate.toggleAttribute('data-overflowing', plateOverflows(measure(plate)))
    })
  }

  const sizes = new ResizeObserver(update)
  const observeBoxes = (): void => {
    sizes.disconnect()
    if (plate.parentElement !== null) sizes.observe(plate.parentElement)
    sizes.observe(plate)
    for (const box of plate.querySelectorAll(':scope > *, :scope > * > *')) {
      sizes.observe(box)
    }
  }
  const pages = new MutationObserver(() => {
    observeBoxes()
    update()
  })

  observeBoxes()
  pages.observe(plate, { childList: true, subtree: true })
  update()

  return () => {
    cancelAnimationFrame(frame)
    sizes.disconnect()
    pages.disconnect()
  }
}
