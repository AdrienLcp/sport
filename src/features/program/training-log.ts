import type { MovementId, Session, SessionId, Station } from './program-types'
import { hasMeasurable, pushUpVariantFor } from './progression'

/**
 * The shapes below are what `localStorage` holds under `seance.log.v1` and what
 * a backup file carries: a field renamed here strands every reading already
 * written on the phone.
 */

export type SetResult = {
  readonly address: string
  readonly round: number
  /** Reps done, or seconds held. The unit comes from the station's effort. */
  readonly value: number
}

export type SessionEntry = {
  readonly day: string
  readonly sessionId: SessionId
  readonly week: number
  readonly results: readonly SetResult[]
  /**
   * Stopped in the middle rather than run to the end. Absent on every entry
   * written before the exit existed, and absent means whole — a session that
   * stopped after three rounds of four has all five movements in it and would
   * otherwise be indistinguishable from a complete one.
   */
  readonly stopped?: true
}

/** The Friday morning reading. Waist is the measure that settles it. */
export type Measure = {
  readonly day: string
  readonly weight?: number
  readonly waist?: number
}

export type Log = {
  readonly version: 1
  readonly entries: readonly SessionEntry[]
  readonly measures?: readonly Measure[]
  /** Strict push-ups on the calibration evening: it fixes the variant. */
  readonly pushUpTest?: number
}

export const EMPTY_LOG: Log = { entries: [], version: 1 }

/** One reading per day: noting twice the same day corrects, never appends. */
export const putMeasure = (log: Log, measure: Measure): Log => {
  const others = (log.measures ?? []).filter(
    (current) => current.day !== measure.day
  )
  return {
    ...log,
    measures: [...others, measure].toSorted((a, b) =>
      a.day.localeCompare(b.day)
    )
  }
}

export const hasHistory = (log: Log): boolean => log.entries.length > 0

/**
 * Whether the starting numbers are already set: a session of fixed efforts
 * run first sets none, and the next session that has some is still the
 * calibration evening.
 */
export const hasCalibrated = (
  log: Log,
  sessions: Readonly<Record<SessionId, Session>>
): boolean =>
  log.entries.some((entry) => hasMeasurable(sessions[entry.sessionId]))

/**
 * The log with its sessions and its calibration struck out, the measures kept:
 * the next session is the calibration evening again. For sessions run only to
 * try the app, which would otherwise set the numbers to beat.
 */
export const withoutSessions = ({ measures }: Log): Log =>
  measures === undefined ? EMPTY_LOG : { entries: [], measures, version: 1 }

/**
 * The number to beat. Same round of the last time this session ran, because a
 * fourth round compared against a first round is a lie in both directions.
 * A session repeated the same evening compares against the week before, never
 * against its own first attempt.
 */
export const numberToBeat = ({
  address,
  log,
  round,
  sessionId,
  today
}: {
  address: string
  log: Log
  round: number
  sessionId: SessionId
  today?: string
}): number | undefined => {
  const previous = log.entries.findLast(
    (entry) => entry.sessionId === sessionId && entry.day !== today
  )
  if (previous === undefined) return undefined

  const forAddress = previous.results.filter(
    (result) => result.address === address
  )
  if (forAddress.length === 0) return undefined

  const sameRound = forAddress.find((result) => result.round === round)
  return (
    sameRound?.value ?? Math.max(...forAddress.map((result) => result.value))
  )
}

/** The push-up slot follows the calibration evening, never a menu. */
export const movementOf = (
  station: Station,
  log: Pick<Log, 'pushUpTest'>
): MovementId => {
  if (station.calibrated !== true || log.pushUpTest === undefined) {
    return station.movement
  }
  return pushUpVariantFor(log.pushUpTest)
}
