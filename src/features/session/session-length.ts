import { MOVEMENTS } from '@programme/movements'

import {
  isFree,
  type Session,
  type Station
} from '@/features/program/program-types'
import {
  DEFAULT_TEMPO,
  isPerSide,
  isTimed,
  targetFor
} from '@/features/program/progression'

/** Getting into place, reading the plate, pressing the button. */
const CHANGEOVER_SECONDS = 15

/** The programme states three minutes of warm-up; the drills fill them. */
const WARMUP_SECONDS = 180

/** A counted stretch — the cat-cow — takes about a minute. */
const COUNTED_STRETCH_SECONDS = 60

const stationSeconds = (station: Station, week: number): number => {
  const target = targetFor(station.effort, week)
  const sides = isPerSide(station.effort) ? 2 : 1
  if (isTimed(station.effort)) return target * sides + CHANGEOVER_SECONDS

  const tempo = MOVEMENTS[station.movement].tempo ?? DEFAULT_TEMPO
  const rep = tempo.down + tempo.bottom + tempo.up + tempo.top
  return target * sides * rep + CHANGEOVER_SECONDS
}

const circuitSeconds = (session: Session, week: number): number => {
  const { shape } = session
  if (shape.kind === 'emom') {
    return shape.rounds * session.circuit.length * shape.stationSeconds
  }
  const round = session.circuit.reduce(
    (total, station) => total + stationSeconds(station, week),
    0
  )
  return shape.rounds * round + (shape.rounds - 1) * shape.restSeconds
}

const cooldownSeconds = (session: Session): number =>
  session.cooldown.reduce((total, entry) => {
    if (isFree(entry)) return total + entry.seconds
    const held = entry.seconds ?? COUNTED_STRETCH_SECONDS
    return total + held * (entry.perSide === true ? 2 : 1)
  }, 0)

/**
 * About how long tonight's session runs, to the nearest five minutes. The
 * rounds ramp makes the first week half the length of the fourth, and a plate
 * that printed « 30 min » in week one would be the first thing it got wrong.
 */
export const sessionMinutes = (session: Session, week: number): number => {
  const warmup = session.warmup.length > 0 ? WARMUP_SECONDS : 0
  const seconds =
    warmup + circuitSeconds(session, week) + cooldownSeconds(session)
  return Math.max(5, Math.round(seconds / 300) * 5)
}
