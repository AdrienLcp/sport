import type React from 'react'
import { useEffectEvent, useLayoutEffect, useRef } from 'react'

import { usePrefersReducedMotion } from '@/infrastructure/browser'

import { observePlateFit } from './plate-fit'
import './plate.sass'

type PlateProps = {
  children: React.ReactNode
  /**
   * How the plate lays out on a desk (default: `'single'`):
   * - `'single'` — one page
   * - `'spread'` — two pages, `.first-page` beside `.second-page`; a phone
   *   dissolves them back into one column
   */
  variant?: 'single' | 'spread'
  /** The root class of the page drawn on the plate, beside `plate`. */
  className?: string
}

const classNames = (
  ...names: readonly (string | false | undefined)[]
): string =>
  names.filter((name) => typeof name === 'string' && name !== '').join(' ')

export const Plate: React.FC<PlateProps> = ({
  children,
  className,
  variant = 'single'
}) => {
  const plate = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (plate.current === null) return
    return observePlateFit(plate.current)
  }, [])

  return (
    <article className={classNames('plate', variant, className)} ref={plate}>
      {children}
    </article>
  )
}

export type Chrono = {
  /** 1 when the time is whole, 0 when it is spent. */
  ratio: number
  state: 'rest' | 'set'
  /**
   * Present while the clock runs: from `ratio`, the rule glides down to
   * nothing over `secondsLeft`, drawn by the browser rather than by a render
   * per frame. A new `key` starts a new glide; reduced motion steps with
   * `ratio` instead.
   */
  run?: { readonly key: string; readonly secondsLeft: number }
}

const clampToUnit = (value: number): number => Math.max(0, Math.min(1, value))

type ChronoRuleProps = {
  chrono: Chrono
}

const ChronoRule: React.FC<ChronoRuleProps> = ({ chrono }) => {
  const rule = useRef<HTMLSpanElement>(null)
  const isStill = usePrefersReducedMotion()
  const runKey = chrono.run?.key

  const glide = useEffectEvent((drawn: HTMLSpanElement) => {
    const { ratio, run } = chrono
    if (run === undefined) return undefined
    return drawn.animate(
      [
        { transform: `scaleX(${clampToUnit(ratio)})` },
        { transform: 'scaleX(0)' }
      ],
      {
        duration: Math.max(0, run.secondsLeft) * 1000,
        easing: 'linear',
        fill: 'forwards'
      }
    )
  })

  useLayoutEffect(() => {
    if (rule.current === null || runKey === undefined || isStill) return
    const animation = glide(rule.current)
    return () => animation?.cancel()
  }, [runKey, isStill])

  return (
    <span
      className='chrono'
      data-state={chrono.state}
      ref={rule}
      style={{ '--chrono-scale': clampToUnit(chrono.ratio) }}
    />
  )
}

type PlateHeadProps = {
  /**
   * The rule under the band, withdrawing as the time is spent. Absent when no
   * time is running: the band stays a plain rule.
   */
  chrono?: Chrono
  /**
   * 0 to 1 of the day's count. The chrono's twin: the same rule, laid down as
   * the day fills instead of withdrawn as time is spent.
   */
  gauge?: number
  /** Printed dim at the right end of the band: a rank, a date, a clock. */
  rank?: string
  title: string
}

export const PlateHead: React.FC<PlateHeadProps> = ({
  chrono,
  gauge,
  rank,
  title
}) => (
  <header className='plate-head'>
    <span>{title}</span>
    {rank !== undefined && <span className='rank'>{rank}</span>}
    {chrono !== undefined && <ChronoRule chrono={chrono} />}
    {gauge !== undefined && (
      <span
        className='gauge'
        data-full={gauge >= 1}
        style={{ '--gauge-scale': clampToUnit(gauge) }}
      />
    )}
  </header>
)

type FigureFrameProps = {
  children: React.ReactNode
  /** Classes of the page that places the frame, beside `figure-frame`. */
  className?: string
  /**
   * The element drawn (default: `'div'`); `'figure'` when the frame carries its
   * own caption.
   */
  element?: 'div' | 'figure'
  /** Lays the drawing down like ink when the plate turns (default: `false`). */
  isTurning?: boolean
}

/** The slot a figure is drawn into: its size is fixed and the drawing fills it. */
export const FigureFrame: React.FC<FigureFrameProps> = ({
  children,
  className,
  element: Element = 'div',
  isTurning = false
}) => (
  <Element
    className={classNames('figure-frame', isTurning && 'turning', className)}
  >
    {children}
  </Element>
)
