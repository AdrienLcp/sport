import type { FigureId, Tempo } from '@/features/program/program-types'
import { DEFAULT_TEMPO } from '@/features/program/progression'

import { COUNTERPOSES, PASSINGS } from './counterposes'
import {
  BONES,
  type Bone,
  JOINT_IDS,
  type JointId,
  type Joints,
  jointsOf,
  POSES,
  type Point,
  type Pose,
  ROOT
} from './poses'

/**
 * The plate moves. A manual of gymnastics prints two figures side by side; a
 * screen can let the one figure do the movement, at the tempo the set asks for,
 * so the three seconds down are shown instead of written.
 *
 * Two traps decide this whole file.
 *
 * A straight line between two joint positions does not keep the bone's length.
 * A shin travelling from locked to folded loses a fifth of itself halfway
 * across, and the figure turns to rubber — a worse tell than the robotic tempo
 * everybody warns about. So the interpolation is polar and runs down the
 * skeleton from the hip: each bone turns around its parent, and carries its
 * length from one drawing to the other rather than having it recomputed from a
 * midpoint. Carrying it is not the same as fixing it: a limb that turns out of
 * the sagittal plane is genuinely shorter on the page, and the two drawings say
 * by how much.
 *
 * A body that reverses direction leaves and arrives at a standstill. Linear
 * time is the robot; the sine ease is not a taste here, it is what a squat
 * does at the bottom.
 */

const TAU = Math.PI * 2

const lengthOf = (from: Point, to: Point): number => {
  return Math.hypot(to[0] - from[0], to[1] - from[1])
}

const angleOf = (from: Point, to: Point): number => {
  return Math.atan2(to[1] - from[1], to[0] - from[0])
}

const polar = (from: Point, angle: number, length: number): Point => {
  return [
    from[0] + Math.cos(angle) * length,
    from[1] + Math.sin(angle) * length
  ]
}

/** The short way round: a limb turning 10 degrees never takes the 350 road. */
const turn = (from: number, to: number, t: number): number => {
  let delta = (to - from) % TAU
  if (delta > Math.PI) delta -= TAU
  if (delta < -Math.PI) delta += TAU
  return from + delta * t
}

/**
 * Bones ordered so a parent is always solved before its children. The drawing
 * order in BONES puts the far side first, which places an elbow before the
 * shoulder it hangs from: right for ink, useless for kinematics.
 */
const CHAIN: readonly Bone[] = (() => {
  const solved = new Set<JointId>([ROOT])
  const ordered: Bone[] = []
  const left = [...BONES]

  while (left.length > 0) {
    const index = left.findIndex((bone) => solved.has(bone.from))
    if (index === -1) break
    const taken = left.splice(index, 1)[0]
    if (taken === undefined) break
    ordered.push(taken)
    solved.add(taken.to)
  }

  return ordered
})()

/**
 * The joint that barely moves between the two drawings is what the body is
 * pushing against: the planted foot, the hand on the floor, the shoulder on the
 * mat. Anchoring the rebuilt pose there keeps the contact exactly where it was
 * drawn — measuring the lowest point instead would lift the whole calf raise,
 * whose heel is meant to drop below the step it stands on.
 */
const contactOf = (reference: Joints, drawn: Joints): JointId | undefined => {
  let anchor: JointId | undefined
  let best = Infinity

  for (const key of JOINT_IDS) {
    const a = reference[key]
    const b = drawn[key]
    if (a === undefined || b === undefined) continue
    const moved = lengthOf(a, b)
    if (moved < best) {
      best = moved
      anchor = key
    }
  }

  return anchor
}

/** Out of a standstill and back into one: what a body does when it reverses. */
const ease = (t: number): number => {
  return (1 - Math.cos(Math.PI * t)) / 2
}

export const interpolate = (from: Pose, to: Pose, t: number): Joints => {
  const start = jointsOf(from)
  const end = jointsOf(to)
  const eased = ease(t)

  const rootStart = start[ROOT]
  const rootEnd = end[ROOT]
  if (rootStart === undefined || rootEnd === undefined) return start

  const built: Joints = {
    hip: [
      rootStart[0] + (rootEnd[0] - rootStart[0]) * eased,
      rootStart[1] + (rootEnd[1] - rootStart[1]) * eased
    ]
  }

  for (const bone of CHAIN) {
    const parent = built[bone.from]
    const startParent = start[bone.from]
    const startChild = start[bone.to]
    const endParent = end[bone.from]
    const endChild = end[bone.to]
    if (parent === undefined) continue
    if (startParent === undefined || startChild === undefined) continue
    if (endParent === undefined || endChild === undefined) continue

    const angle = turn(
      angleOf(startParent, startChild),
      angleOf(endParent, endChild),
      eased
    )
    const was = lengthOf(startParent, startChild)
    const becomes = lengthOf(endParent, endChild)
    built[bone.to] = polar(parent, angle, was + (becomes - was) * eased)
  }

  /*
   * Hanging the whole body off the hip makes the foot drift: the chain is
   * solved downward, so every rounding along it lands in the contact, and the
   * figure slides across the plate while it squats. The body moves around what
   * it is pushing against, never the reverse — so the contact is put back where
   * it belongs and everything else follows it.
   */
  const contact = contactOf(start, end)
  const before = contact === undefined ? undefined : start[contact]
  const after = contact === undefined ? undefined : end[contact]
  const made = contact === undefined ? undefined : built[contact]

  if (before !== undefined && after !== undefined && made !== undefined) {
    const shift: Point = [
      before[0] + (after[0] - before[0]) * eased - made[0],
      before[1] + (after[1] - before[1]) * eased - made[1]
    ]
    for (const key of JOINT_IDS) {
      const point = built[key]
      if (point !== undefined)
        built[key] = [point[0] + shift[0], point[1] + shift[1]]
    }
  }

  return built
}

export type Beat = {
  readonly pose: Pose
  /** Seconds spent travelling into this beat; the first is entered from the last. */
  readonly travel: number
  /** Seconds motionless on arrival — the pause that makes a rep a rep. */
  readonly hold: number
}

export type Motion = readonly Beat[]

export const cycleSeconds = (motion: Motion): number => {
  return motion.reduce((total, each) => total + each.travel + each.hold, 0)
}

/**
 * Where the body is, `seconds` into the cycle. The cycle opens on the printed
 * plate, holds it, then travels through every other beat and comes back.
 */
export const sample = (motion: Motion, seconds: number): Joints => {
  const total = cycleSeconds(motion)
  let left = ((seconds % total) + total) % total

  for (let index = 0; index < motion.length; index += 1) {
    const here = motion[index]
    const next = motion[(index + 1) % motion.length]
    if (here === undefined || next === undefined) break

    if (left < here.hold) return jointsOf(here.pose)
    left -= here.hold

    if (left < next.travel)
      return interpolate(here.pose, next.pose, left / next.travel)
    left -= next.travel
  }

  const first = motion[0]
  return first === undefined ? {} : jointsOf(first.pose)
}

const printed = (figure: FigureId, travel: number, hold: number): Beat => {
  return { hold, pose: POSES[figure], travel }
}

/**
 * The counterpose exactly as drawn. Its lengths used to be replaced by the
 * printed plate's, on the reasoning that one body cannot own two femurs. But a
 * side view foreshortens every limb that leaves the sagittal plane, and the
 * plates are drawn that way on purpose: mountain climbers print one shin at 15
 * and the other at 30 because one of them is tucked under the body. Forcing the
 * printed length onto the drawn angle sent the foot twenty-five units through
 * the floor on four figures. interpolate() already carries each bone's length
 * from one drawing to the other, so the foreshortening now travels with the
 * limb instead of being thrown away before the movement starts.
 *
 * Props are inherited from the printed plate: a chair does not move because a
 * body does.
 */
const counter = (figure: FigureId, travel: number, hold: number): Beat => {
  const drawn = COUNTERPOSES[figure]
  if (drawn === undefined) throw new Error(`${figure} has no counterpose`)
  return {
    hold,
    pose: { ...drawn, props: drawn.props ?? POSES[figure].props },
    travel
  }
}

/**
 * A crossing on the way through, for the gestures whose limbs trade places. It
 * never holds: nobody pauses mid-stride, and a pause there would teach a beat
 * the movement does not have.
 */
const passing = (figure: FigureId, index: 0 | 1, travel: number): Beat => {
  const drawn = PASSINGS[figure]?.[index]
  if (drawn === undefined)
    throw new Error(`${figure} has no passing pose ${index}`)
  return {
    hold: 0,
    pose: { ...drawn, props: drawn.props ?? POSES[figure].props },
    travel
  }
}

/**
 * Each cycle opens on the printed pose, so a figure at rest is the plate again.
 * A hold is a real pause under load and not a beat of animation grammar: the
 * quarter second at the bottom of a squat is the one that makes it count.
 *
 * The three pure holds — plank, side plank, hollow — are absent on purpose.
 * The movement does not move, so neither does the plate. So are the counted
 * strength movements: their cycle is the rep's tempo (`LOW_ENDS`).
 */
export const MOTIONS: Partial<Record<FigureId, Motion>> = {
  'arm-circle': [
    printed('arm-circle', 0.4, 0.08),
    passing('arm-circle', 0, 0.4),
    counter('arm-circle', 0.4, 0.08),
    passing('arm-circle', 1, 0.4)
  ],
  'cat-cow': [printed('cat-cow', 1.3, 0.5), counter('cat-cow', 1.3, 0.5)],
  'external-rotation': [
    printed('external-rotation', 0.5, 0.35),
    passing('external-rotation', 0, 0.45),
    counter('external-rotation', 0.5, 0.4),
    passing('external-rotation', 1, 0.45)
  ],
  'hip-circle': [
    printed('hip-circle', 0.9, 0.3),
    counter('hip-circle', 0.9, 0.3)
  ],
  'knee-march': [
    printed('knee-march', 0.3, 0.1),
    passing('knee-march', 0, 0.3),
    counter('knee-march', 0.3, 0.1),
    passing('knee-march', 1, 0.3)
  ],
  'mountain-climber': [
    printed('mountain-climber', 0.15, 0.06),
    passing('mountain-climber', 0, 0.15),
    counter('mountain-climber', 0.15, 0.06),
    passing('mountain-climber', 1, 0.15)
  ],
  'scapular-push-up': [
    printed('scapular-push-up', 0.7, 0.35),
    counter('scapular-push-up', 0.6, 0.3)
  ],
  'shadow-box': [
    printed('shadow-box', 0.26, 0.1),
    counter('shadow-box', 0.3, 0.16)
  ],
  'shoulder-roll': [
    printed('shoulder-roll', 0.45, 0.1),
    passing('shoulder-roll', 0, 0.45),
    counter('shoulder-roll', 0.45, 0.1),
    passing('shoulder-roll', 1, 0.45)
  ],
  walk: [
    printed('walk', 0.22, 0.04),
    passing('walk', 0, 0.22),
    counter('walk', 0.22, 0.04),
    passing('walk', 1, 0.22)
  ]
}

/**
 * The strength movements, and which of their two drawings is the bottom of the
 * rep. Their cycle is not drawn by hand: it is the tempo the plate states, two
 * seconds down and one up unless the movement says otherwise, so a reader who
 * follows the figure is doing the rep exactly as the programme writes it.
 */
const LOW_ENDS: Partial<Record<FigureId, 'counter' | 'printed'>> = {
  'calf-raise': 'counter',
  'hip-thrust': 'counter',
  'hip-thrust-single': 'counter',
  'lunge-back': 'printed',
  'push-up': 'counter',
  'push-up-feet-raised': 'counter',
  'push-up-incline': 'counter',
  'push-up-knees': 'counter',
  'push-up-narrow': 'printed',
  'rdl-single': 'printed',
  'row-dumbbell': 'counter',
  squat: 'printed',
  ytw: 'counter'
}

/** Whether the figure keeps a rep's tempo, which the plate then states. */
export const isPaced = (figure: FigureId): boolean =>
  LOW_ENDS[figure] !== undefined

const paced = (
  figure: FigureId,
  low: 'counter' | 'printed',
  tempo: Tempo
): Motion =>
  low === 'printed'
    ? [
        printed(figure, tempo.down, tempo.bottom),
        counter(figure, tempo.up, tempo.top)
      ]
    : [
        printed(figure, tempo.up, tempo.top),
        counter(figure, tempo.down, tempo.bottom)
      ]

/**
 * One motion per figure and tempo, built once: the figure restarts its cycle
 * whenever it is handed a different motion, and a fresh array every render
 * would pin it to the first frame.
 */
const PACED = new Map<string, Motion>()

export const motionFor = (
  figure: FigureId,
  tempo: Tempo = DEFAULT_TEMPO
): Motion | undefined => {
  const low = LOW_ENDS[figure]
  if (low === undefined) return MOTIONS[figure]

  const key = `${figure}:${tempo.down}:${tempo.bottom}:${tempo.up}:${tempo.top}`
  const known = PACED.get(key)
  if (known !== undefined) return known
  const built = paced(figure, low, tempo)
  PACED.set(key, built)
  return built
}

/**
 * The frame has to hold every pose of the cycle at once, or the viewBox is
 * recomputed each frame and the whole drawing breathes while the body moves.
 */
export const posesOf = (
  motion: Motion | undefined,
  still: Pose
): readonly Pose[] => {
  return motion === undefined ? [still] : motion.map((each) => each.pose)
}

/**
 * Reduced motion keeps the information and drops the movement: the plate prints
 * the far end of the gesture as a ghost behind the working pose, which is what
 * a paper manual does anyway.
 */
export const ghostOf = (motion: Motion | undefined): Pose | undefined => {
  const [first, second] = motion ?? []
  if (motion === undefined || first === undefined || second === undefined) {
    return undefined
  }

  const still = jointsOf(first.pose)
  let furthest = second.pose
  let best = -1

  for (const candidate of motion.slice(1)) {
    const joints = jointsOf(candidate.pose)
    const spread = JOINT_IDS.reduce((sum, key) => {
      const a = still[key]
      const b = joints[key]
      return a === undefined || b === undefined ? sum : sum + lengthOf(a, b)
    }, 0)
    if (spread > best) {
      best = spread
      furthest = candidate.pose
    }
  }

  return furthest
}
