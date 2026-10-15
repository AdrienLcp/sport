import type { Joints, Point, Pose } from './poses'

/**
 * Which side of the body is its front, as a turn from the trunk's axis:
 * `1` or `-1`. A stick figure lying flat reads the same face up and face down
 * — the floor Y-T-W was taken for a figure on its back (October 2026) — so the
 * profile plates print a nose before the head and a seat behind the hip.
 */
export type Handedness = 1 | -1

const unit = ([x, y]: Point): Point => {
  const length = Math.hypot(x, y) || 1
  return [x / length, y / length]
}

const from = (start: Point, end: Point): Point =>
  unit([end[0] - start[0], end[1] - start[1]])

const along = (point: Point, direction: Point, distance: number): Point => [
  point[0] + direction[0] * distance,
  point[1] + direction[1] * distance
]

/** The front of a body whose axis runs along `axis`, toward the head or the feet alike. */
const frontOf = (axis: Point, side: Handedness): Point => [
  side * axis[1],
  -side * axis[0]
]

const SCREEN: Record<NonNullable<Pose['front']>, Point> = {
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
  up: [0, -1]
}

/** A foot bent less than this off its shin points along the leg and says nothing. */
const FOOT_BEND = 0.35

/**
 * The pose's handedness: from `front` when the pose names it, else from the
 * foot, which points forward off the shin. Undefined for a plate seen from the
 * front, where the body's width already reads, and for a pointed foot with no
 * `front` to settle it.
 */
export const handednessOf = (
  pose: Pose,
  joints: Joints
): Handedness | undefined => {
  if (pose.collar !== undefined) return undefined
  const { ankle, head, hip, knee, shoulder, toe } = joints

  if (pose.front !== undefined) {
    if (hip === undefined || (shoulder ?? head) === undefined) return undefined
    const axis = from(hip, shoulder ?? head ?? hip)
    const [x, y] = frontOf(axis, 1)
    const [toward, down] = SCREEN[pose.front]
    return x * toward + y * down >= 0 ? 1 : -1
  }

  if (toe === undefined || ankle === undefined || knee === undefined)
    return undefined
  const shin = from(knee, ankle)
  const foot = from(ankle, toe)
  const bend = shin[0] * foot[1] - shin[1] * foot[0]
  if (Math.abs(bend) < FOOT_BEND) return undefined
  return bend > 0 ? 1 : -1
}

const NOSE_BASE = 5
const NOSE_TIP = 11
const NOSE_HALF_WIDTH = 3.4

/** A filled wedge off the head, on the face's side. Empty without a head on a neck. */
export const nosePath = (joints: Joints, side: Handedness): string => {
  const { head, shoulder } = joints
  if (head === undefined || shoulder === undefined) return ''
  const nose = frontOf(from(shoulder, head), side)
  const across: Point = [-nose[1], nose[0]]
  const base = along(head, nose, NOSE_BASE)
  const tip = along(head, nose, NOSE_TIP)
  const left = along(base, across, NOSE_HALF_WIDTH)
  const right = along(base, across, -NOSE_HALF_WIDTH)
  return `M${left[0].toFixed(2)} ${left[1].toFixed(2)} L${tip[0].toFixed(2)} ${tip[1].toFixed(2)} L${right[0].toFixed(2)} ${right[1].toFixed(2)} Z`
}

const SEAT_UP = 11
const SEAT_DOWN = 9
const SEAT_DEPTH = 14
/** The seat leans toward the thigh a little, where the glutes actually sit. */
const SEAT_LEAN = 0.25

/** A curve bulging behind the hip, from the low back to the top of the thigh. */
export const seatPath = (joints: Joints, side: Handedness): string => {
  const { hip, knee, spine } = joints
  if (hip === undefined || knee === undefined || spine === undefined) return ''
  const up = from(hip, spine)
  const down = from(hip, knee)
  const back = unit(along(frontOf(up, side === 1 ? -1 : 1), down, -SEAT_LEAN))
  const start = along(hip, up, SEAT_UP)
  const end = along(hip, down, SEAT_DOWN)
  const bulge = along(hip, back, SEAT_DEPTH)
  return `M${start[0].toFixed(2)} ${start[1].toFixed(2)} Q${bulge[0].toFixed(2)} ${bulge[1].toFixed(2)} ${end[0].toFixed(2)} ${end[1].toFixed(2)}`
}
