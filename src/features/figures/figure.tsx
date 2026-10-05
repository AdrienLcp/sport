import type React from 'react'
import { useEffect, useState } from 'react'

import type { FigureId, Tempo } from '@/features/program/program-types'
import { usePrefersReducedMotion } from '@/infrastructure/browser'
import { Button } from '@/presentation/components/button'
import { VisuallyHidden } from '@/presentation/components/visually-hidden'
import { useLocalize, useTranslate } from '@/presentation/i18n/i18n-provider'

import { FIGURE_LABELS } from './figure-labels'
import {
  cycleSeconds,
  ghostOf,
  type Motion,
  motionFor,
  posesOf,
  sample
} from './motion'
import {
  BONES,
  type Bone,
  frameOf,
  type JointId,
  type Joints,
  jointsOf,
  POSES,
  type Point,
  type Segment
} from './poses'

import './figure.sass'

/*
 * Line weight is the depth system: a heavy torso, a lighter thigh, a lighter
 * shin still, and the far side thinner and spent. Parallel limbs stop merging
 * into the body the moment the weights differ.
 */
const TORSO = 8
const THIGH = 5.5
const SHIN = 4.2
const FOOT = 3.6
const UPPER_ARM = 4.8
const FOREARM = 4.2
const NECK = 4.6
const FAR = 4.2
const PROP = 2.2
const GROUND_WEIGHT = 1.6
const HEAD_RADIUS = 7

/**
 * The gesture repeats without end. Three showings then a rest was the earlier
 * choice — a loop reads as wallpaper and costs battery on a propped phone — but
 * a demonstration that freezes while the reader is still reading the cue has
 * stopped demonstrating (first real use, September 2026). A finite count is this
 * one constant away.
 */
const SHOWINGS = Infinity

/** The plate is still being laid down for --turn; the body waits its turn. */
const AFTER_THE_TURN = 0.42

const WEIGHT: Partial<Record<JointId, number>> = {
  ankle: SHIN,
  elbow: UPPER_ARM,
  head: NECK,
  heel: FOOT,
  knee: THIGH,
  shoulder: TORSO,
  spine: TORSO,
  toe: FOOT,
  wrist: FOREARM
}

const weightOf = (bone: Bone): number =>
  bone.far ? FAR : (WEIGHT[bone.to] ?? FOOT)

const line = (from: Point, to: Point): string =>
  `M${from[0].toFixed(2)} ${from[1].toFixed(2)} L${to[0].toFixed(2)} ${to[1].toFixed(2)}`

/**
 * The trunk as one curve from hip to shoulder, bent through the mid-back. Two
 * straight halves would print a hinge — a tent, not a back — and the cat-cow is
 * exactly the plate where the back must read as a back.
 */
const trunk = (hip: Point, spine: Point, shoulder: Point): string => {
  const control: Point = [
    2 * spine[0] - (hip[0] + shoulder[0]) / 2,
    2 * spine[1] - (hip[1] + shoulder[1]) / 2
  ]
  return `M${hip[0].toFixed(2)} ${hip[1].toFixed(2)} Q${control[0].toFixed(2)} ${control[1].toFixed(2)} ${shoulder[0].toFixed(2)} ${shoulder[1].toFixed(2)}`
}

/** The path a bone draws; the trunk's two halves draw as one, on the upper half. */
const pathOf = (bone: Bone, joints: Joints): string | undefined => {
  if (bone.to === 'spine') return undefined
  const from = joints[bone.from]
  const to = joints[bone.to]
  if (from === undefined || to === undefined) return undefined
  const hip = joints.hip
  if (bone.from === 'spine' && hip !== undefined) return trunk(hip, from, to)
  return line(from, to)
}

type BodyProps = {
  /**
   * Drawn as a construction line (default: `false`): the far end of the
   * gesture printed behind the working pose under reduced motion.
   */
  isGhost?: boolean
  joints: Joints
}

export const Body: React.FC<BodyProps> = ({ isGhost = false, joints }) => {
  const head = joints.head

  return (
    <g
      className='figure-body'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      {BONES.map((bone) => {
        // The ghost drops its far side: depth drawn twice over the same body
        // reads as a tangle, not as two poses.
        if (isGhost && bone.far) return null

        const d = pathOf(bone, joints)
        if (d === undefined) return null

        return (
          <path
            className={isGhost ? 'ghost-limb' : bone.far ? 'far-limb' : 'limb'}
            d={d}
            key={`${bone.from}-${bone.to}`}
            strokeWidth={weightOf(bone)}
          />
        )
      })}

      {head !== undefined && (
        <circle
          className={isGhost ? 'ghost-head' : 'head'}
          cx={head[0]}
          cy={head[1]}
          r={HEAD_RADIUS}
        />
      )}
    </g>
  )
}

type StageProps = {
  /** The floor line, measured to the frame. */
  ground: Segment
  /** Chair, table, step, wall: whatever the body pushes against. */
  props: readonly Segment[]
}

export const Stage: React.FC<StageProps> = ({ ground, props: furniture }) => (
  <g
    className='figure-stage'
    fill='none'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d={line(ground[0], ground[1])} strokeWidth={GROUND_WEIGHT} />
    {furniture.map((prop) => (
      <path
        d={line(prop[0], prop[1])}
        key={line(prop[0], prop[1])}
        strokeWidth={PROP}
      />
    ))}
  </g>
)

/**
 * requestAnimationFrame is already suspended while the tab is hidden, so a
 * backgrounded plate costs nothing and needs no visibility wiring of its own.
 */
const useGesture = ({
  isStill,
  motion,
  take
}: {
  isStill: boolean
  motion: Motion | undefined
  take: string
}): Joints | undefined => {
  const [shown, setShown] = useState<{
    joints: Joints | undefined
    take: string
  }>({ joints: undefined, take })

  useEffect(() => {
    if (motion === undefined || isStill) return

    const until = cycleSeconds(motion) * SHOWINGS
    let frame = 0
    let opened = 0

    const draw = (now: number) => {
      if (opened === 0) opened = now
      const seconds = (now - opened) / 1000 - AFTER_THE_TURN

      if (seconds >= until) {
        setShown({ joints: undefined, take })
        return
      }

      setShown({
        joints: seconds <= 0 ? undefined : sample(motion, seconds),
        take
      })
      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [motion, take, isStill])

  // A plate that has just turned owns nothing the previous one drew: the take
  // is read during render so the new figure never shows the old body's last
  // frame while it waits out the turn.
  return shown.take === take ? shown.joints : undefined
}

type FigureProps = {
  id: FigureId
  /** The rep's rhythm, for a figure that keeps one (default: the programme's). */
  tempo?: Tempo
}

/** The one renderer every plate goes through. A tap on it replays the gesture. */
export const Figure: React.FC<FigureProps> = ({ id, tempo }) => {
  const translate = useTranslate()
  const localize = useLocalize()
  const isStill = usePrefersReducedMotion()
  const [replay, setReplay] = useState(0)

  const printed = POSES[id]
  const motion = motionFor(id, tempo)
  const moving = useGesture({
    isStill,
    motion,
    take: `${id}-${tempo === undefined ? '' : Object.values(tempo).join('.')}-${replay}`
  })

  const { box, ground } = frameOf(...posesOf(motion, printed))
  const ghost = isStill ? ghostOf(motion) : undefined

  const plate = (
    <svg aria-label={localize(FIGURE_LABELS[id])} role='img' viewBox={box}>
      <Stage ground={ground} props={printed.props ?? []} />
      {ghost !== undefined && <Body isGhost joints={jointsOf(ghost)} />}
      <Body joints={moving ?? jointsOf(printed)} />
    </svg>
  )

  if (motion === undefined || isStill) return plate

  return (
    <Button className='figure-replay' onPress={() => setReplay(replay + 1)}>
      {plate}
      <VisuallyHidden elementType='span'>
        {translate('figure.replay')}
      </VisuallyHidden>
    </Button>
  )
}
