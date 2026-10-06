import type { Effort, MovementId, Session, Tempo } from './program-types'

export const BLOCK_WEEKS = 4

export const isTimed = (effort: Effort): boolean =>
  effort.kind === 'hold' || effort.kind === 'holdPerSide'

export const isPerSide = (effort: Effort): boolean =>
  effort.kind === 'repsPerSide' || effort.kind === 'holdPerSide'

/**
 * A range leaves a starting number to find on the calibration evening; a fixed
 * effort — three minutes of shadow boxing — is simply done, never measured.
 */
export const isMeasurable = (effort: Effort): boolean => effort.from < effort.to

export const hasMeasurable = (session: Session): boolean =>
  session.circuit.some((station) => isMeasurable(station.effort))

/**
 * Double progression, as the block defines it: one rep more per week until the
 * top of the range, five seconds more per week on a hold. Past the top, the
 * variant changes — that is a block-2 decision, not something the app invents.
 */
export const targetFor = (effort: Effort, week: number): number => {
  const elapsed = Math.max(0, week - 1)
  const step = isTimed(effort) ? 5 : 1
  return Math.min(effort.from + step * elapsed, effort.to)
}

/** The push-up count from the calibration evening fixes the variant for the block. */
export const pushUpVariantFor = (testReps: number): MovementId => {
  if (testReps <= 2) return 'push-up-incline-high'
  if (testReps <= 7) return 'push-up-knees'
  if (testReps <= 15) return 'push-up'
  return 'push-up-feet-raised'
}

/**
 * The rounds ramp: two the first week, three the second, then the full four. A
 * beginner who starts on four finishes one and gives up; two clean rounds build
 * more than one round in agony.
 */
export const roundsFor = (week: number): number => {
  if (week <= 1) return 2
  if (week === 2) return 3
  return 4
}

/** The session as it runs this week: the ramp caps its rounds, never raises them. */
export const sessionAtWeek = (session: Session, week: number): Session => ({
  ...session,
  shape: {
    ...session.shape,
    rounds: Math.min(session.shape.rounds, roundsFor(week))
  }
})

/** The programme's default rep: two seconds down, one up, no bounce, no pause. */
export const DEFAULT_TEMPO: Tempo = { bottom: 0, down: 2, top: 0, up: 1 }
