import {
  isFree,
  type Session,
  type SessionId,
  type Station
} from '@/features/program/program-types'
import { isPerSide, isTimed } from '@/features/program/progression'
import type { SetResult } from '@/features/program/training-log'

export type Stage = 'cooldown' | 'done' | 'rest' | 'set' | 'title' | 'warmup'

export type RunState = {
  readonly stage: Stage
  /** Flat cursor: the warm-up drill while warming up, then round and station
      across the whole circuit. It restarts at zero when the circuit opens. */
  readonly step: number
  /** Timed per-side holds run twice; 0 is the left side. */
  readonly side: 0 | 1
  readonly firstSide?: number
  readonly restSeconds: number
  readonly results: readonly SetResult[]
  /** The circuit was ended early: the stretches still come, the log says so. */
  readonly isCutShort?: true
}

/**
 * An interrupted session resumes at its address, never at the top of the
 * round. Stored under `seance.run.v1`: a field renamed here loses the session a
 * phone was in the middle of.
 */
export type RunSnapshot = {
  readonly day: string
  readonly sessionId: SessionId
  readonly stage: 'cooldown' | 'rest' | 'set' | 'warmup'
  readonly step: number
  readonly side: 0 | 1
  readonly firstSide?: number
  readonly restSeconds: number
  readonly results: readonly SetResult[]
  /** Absent on every snapshot written before the early exit led to the stretches. */
  readonly isCutShort?: true
}

export type RunAction =
  | { readonly type: 'begin' }
  | { readonly type: 'endDrill' }
  | {
      readonly type: 'completeSet'
      readonly value: number
      readonly elapsed: number
    }
  | { readonly type: 'endRest' }
  | { readonly type: 'nextStretch' }
  | { readonly type: 'endCooldown' }
  | { readonly type: 'endCircuitEarly' }
  | { readonly type: 'stop' }
  | { readonly type: 'restart' }

export const INITIAL_RUN: RunState = {
  restSeconds: 0,
  results: [],
  side: 0,
  stage: 'title',
  step: 0
}

/**
 * The cool-down read as a flat list of plates. A stretch held per side is two
 * plates and not one: the app ships no sound and no vibration, so a single
 * sixty-second plate has no way to say « switch sides » halfway through, and
 * a reader face down in a pigeon is not watching a number.
 */
export type Stop = {
  readonly index: number
  readonly side: 0 | 1
}

export const cooldownStops = (session: Session): readonly Stop[] =>
  session.cooldown.flatMap<Stop>((entry, index) =>
    isFree(entry) || entry.perSide !== true
      ? [{ index, side: 0 }]
      : [
          { index, side: 0 },
          { index, side: 1 }
        ]
  )

/** How a ledger line reads: struck through, heavy, or quiet. */
export type LedgerState = 'ahead' | 'done' | 'live'

export const ledgerState = (index: number, current: number): LedgerState => {
  if (index < current) return 'done'
  return index === current ? 'live' : 'ahead'
}

const stationCount = (session: Session): number => session.circuit.length

export const roundsOf = (session: Session): number => session.shape.rounds

export const roundOf = (session: Session, step: number): number =>
  Math.floor(step / stationCount(session)) + 1

export const indexOf = (session: Session, step: number): number =>
  step % stationCount(session)

export const stationAt = (session: Session, step: number): Station => {
  const station = session.circuit[indexOf(session, step)]
  if (station === undefined) {
    throw new Error(`Session ${session.id} has no station at step ${step}`)
  }
  return station
}

const totalSteps = (session: Session): number =>
  stationCount(session) * roundsOf(session)

/** What separates this set from the next: the rest the shape actually grants. */
const restAfter = (session: Session, step: number, elapsed: number): number => {
  if (step >= totalSteps(session)) return 0

  if (session.shape.kind === 'emom') {
    return Math.max(0, Math.round(session.shape.stationSeconds - elapsed))
  }
  const closesRound = indexOf(session, step) === 0
  return closesRound ? session.shape.restSeconds : 0
}

const advance = ({
  elapsed,
  session,
  state,
  value
}: {
  elapsed: number
  session: Session
  state: RunState
  value: number
}): RunState => {
  const station = stationAt(session, state.step)

  // A timed per-side hold is one set in two halves; the shorter side is the
  // honest number, because progression follows the limiting side.
  if (
    isTimed(station.effort) &&
    isPerSide(station.effort) &&
    state.side === 0
  ) {
    return { ...state, firstSide: value, side: 1 }
  }
  const recorded =
    state.firstSide === undefined ? value : Math.min(state.firstSide, value)

  const results = [
    ...state.results,
    {
      address: station.address,
      round: roundOf(session, state.step),
      value: recorded
    }
  ]
  const step = state.step + 1
  const isDone = step >= totalSteps(session)
  const rest = restAfter(session, step, elapsed)

  return {
    firstSide: undefined,
    restSeconds: rest,
    results,
    side: 0,
    stage: isDone ? 'cooldown' : rest > 0 ? 'rest' : 'set',
    // The cursor is reused rather than doubled, the way the circuit already
    // reuses the one the warm-up left behind: entering the cool-down restarts
    // it at its first stretch.
    step: isDone ? 0 : step
  }
}

export const runReducer = (
  session: Session,
  state: RunState,
  action: RunAction
): RunState => {
  switch (action.type) {
    case 'begin':
      return {
        ...INITIAL_RUN,
        stage: session.warmup.length > 0 ? 'warmup' : 'set'
      }
    case 'endDrill': {
      const next = state.step + 1
      return next < session.warmup.length
        ? { ...state, step: next }
        : { ...state, stage: 'set', step: 0 }
    }
    case 'completeSet':
      return advance({
        elapsed: action.elapsed,
        session,
        state,
        value: action.value
      })
    case 'endRest':
      return { ...state, restSeconds: 0, stage: 'set' }
    case 'nextStretch':
      return { ...state, step: state.step + 1 }
    // Ending the circuit early still leads to the stretches: a session cut
    // after two rounds is exactly the one whose body most needs them, and the
    // cool-down plate carries its own way to skip them.
    case 'endCircuitEarly':
      return {
        ...state,
        firstSide: undefined,
        isCutShort: true,
        restSeconds: 0,
        side: 0,
        stage: 'cooldown',
        step: 0
      }
    case 'endCooldown':
    case 'stop':
      return { ...state, stage: 'done' }
    case 'restart':
      return INITIAL_RUN
  }
}
