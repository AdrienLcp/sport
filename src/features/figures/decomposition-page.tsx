import type React from 'react'

import { FIGURE_IDS } from '@/features/program/program-types'
import { useLocalize } from '@/presentation/i18n/i18n-provider'

import { Body, Stage } from './figure'
import { allFigureNames } from './figure-names'
import { interpolate, motionFor, posesOf } from './motion'
import { frameOf, type Joints, jointsOf, POSES } from './poses'

import './decomposition-page.sass'

const STEPS = 6

/** One printed instant: which beat it leaves, and how far along. */
type Frame = {
  instant: string
  joints: Joints
}

/**
 * Every movement decomposed: each gesture printed at six instants of its
 * travel, the way a plate of chronophotography reads. A bone that stretches
 * mid-travel or a foot that sinks through the floor is invisible at speed and
 * obvious in a row.
 */
export const DecompositionPage: React.FC = () => {
  const localize = useLocalize()
  const names = allFigureNames()

  return (
    <div className='decomposition-page'>
      {FIGURE_IDS.map((id) => {
        const still = POSES[id]
        const motion = motionFor(id)
        const { box, ground } = frameOf(...posesOf(motion, still))

        const frames: readonly Frame[] =
          motion === undefined
            ? [{ instant: 'still', joints: jointsOf(still) }]
            : motion.flatMap((beat, index) => {
                const next = motion[(index + 1) % motion.length]
                if (next === undefined) return []
                if (motion.length === 2 && index === 1) return []
                return Array.from({ length: STEPS }, (_, step) => ({
                  instant: `${index}-${step}`,
                  joints: interpolate(beat.pose, next.pose, step / (STEPS - 1))
                }))
              })

        return (
          <section className='gesture' key={id}>
            <h2 className='gesture-name'>
              {localize(names.get(id) ?? { en: id, fr: id })}
            </h2>
            <div className='frames'>
              {frames.map((frame) => (
                <svg
                  aria-hidden='true'
                  className='frame'
                  key={frame.instant}
                  viewBox={box}
                >
                  <Stage ground={ground} props={still.props ?? []} />
                  <Body joints={frame.joints} />
                </svg>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
