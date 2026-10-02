import { BLOCK_1 } from '@programme/program'

import type { ProfileSettings } from '@/features/profile-settings/profile-settings'
import { isTimed, roundsFor, targetFor } from '@/features/program/progression'
import type {
  Log,
  Measure,
  SessionEntry,
  SetResult
} from '@/features/program/training-log'
import { SOURCES } from '@/features/table/table-catalogue'
import type { DayCount, Table } from '@/features/table/table-tally'
import { addDays, type IsoDay, mondayOf } from '@/helpers/days'

/**
 * The specimen: a made-up reader, twelve weeks into the programme, so every
 * plate and every curve can be seen full before a first session. Nothing in it
 * is anyone's: the numbers are drawn from a seeded generator, so the same day
 * always prints the same specimen, and a test can hold it still.
 */
export type Specimen = {
  readonly log: Log
  readonly table: Table
  readonly settings: ProfileSettings
}

const SPECIMEN_WEEKS = 12
const SPECIMEN_SEED = 0x5eed

/** Mulberry32: tiny, seedable, and plenty for made-up numbers. */
const seededRandom = (seed: number): (() => number) => {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** The evenings of each week the specimen trained, Monday = 0. */
const WEEK_PATTERNS: readonly (readonly number[])[] = [
  [0, 2, 4],
  [1, 3],
  [0, 2, 4, 5],
  [0, 1, 3, 4],
  [0, 2, 3, 5],
  [1, 3],
  [0, 1, 2, 3, 4],
  [0, 2, 4, 5],
  [0, 1, 3, 4],
  [0, 2, 3, 4],
  [0, 1, 3, 5],
  [0, 1, 3]
]

const sessionResults = ({
  random,
  sessionIndex,
  stopAfterRound,
  week
}: {
  random: () => number
  sessionIndex: number
  stopAfterRound?: number
  week: number
}): readonly SetResult[] => {
  const session = BLOCK_1[sessionIndex]
  if (session === undefined) return []
  const lastRound =
    stopAfterRound ?? Math.min(session.shape.rounds, roundsFor(week))

  return Array.from({ length: lastRound }, (_, index) => index + 1).flatMap(
    (round) =>
      session.circuit.map((station) => {
        const target = targetFor(station.effort, week)
        const fatigue = (round - 1) * (isTimed(station.effort) ? 3 : 1)
        const swing = Math.round(
          (random() - 0.35) * (isTimed(station.effort) ? 8 : 3)
        )
        return {
          address: station.address,
          round,
          value: Math.max(1, target - fatigue + swing)
        }
      })
  )
}

const specimenLog = (today: string, random: () => number): Log => {
  const thisMonday = mondayOf(today)
  const firstMonday = addDays(thisMonday, -7 * (SPECIMEN_WEEKS - 1))

  const entries: SessionEntry[] = []
  let turn = 1
  let sessionIndex = 0

  WEEK_PATTERNS.forEach((pattern, weekIndex) => {
    for (const offset of pattern) {
      const day = addDays(firstMonday, weekIndex * 7 + offset)
      if (day > today) continue
      const session = BLOCK_1[sessionIndex]
      if (session === undefined) continue
      const isStopped = weekIndex === 5 && offset === 3
      const results = sessionResults({
        random,
        sessionIndex,
        stopAfterRound: isStopped ? 2 : undefined,
        week: turn
      })
      entries.push(
        isStopped
          ? { day, results, sessionId: session.id, stopped: true, week: turn }
          : { day, results, sessionId: session.id, week: turn }
      )
      sessionIndex += 1
      if (sessionIndex === BLOCK_1.length) {
        sessionIndex = 0
        turn += 1
      }
    }
  })

  return {
    entries,
    measures: specimenMeasures(firstMonday, today, random),
    pushUpTest: 9,
    version: 1
  }
}

/** One reading a week, on the Friday: the waist comes down, the scale barely moves. */
const specimenMeasures = (
  firstMonday: string,
  today: string,
  random: () => number
): readonly Measure[] =>
  Array.from({ length: SPECIMEN_WEEKS }, (_, week) => week).flatMap((week) => {
    const day = addDays(firstMonday, week * 7 + 4)
    if (day > today) return []
    const waist = 98.2 - week * 0.55 + (random() - 0.5) * 0.8
    const weight = 86.8 - week * 0.2 + (random() - 0.5) * 0.9
    return [
      {
        day,
        waist: Math.round(waist * 10) / 10,
        weight: Math.round(weight * 10) / 10
      }
    ]
  })

/** Two weeks of counted days, which is all the table keeps. */
const specimenTable = (today: string, random: () => number): Table => {
  const days: Record<string, DayCount> = {}
  for (let back = 13; back >= 0; back -= 1) {
    const count: Record<string, number> = {}
    const taps = back === 0 ? 3 : 5 + Math.floor(random() * 3)
    for (let tap = 0; tap < taps; tap += 1) {
      const source = SOURCES[Math.floor(random() * SOURCES.length)]
      if (source !== undefined) count[source.id] = (count[source.id] ?? 0) + 1
    }
    days[addDays(today, -back)] = count
  }
  return { days, market: { ticked: [], week: '' }, version: 1 }
}

export const makeSpecimen = (day: IsoDay): Specimen => {
  const random = seededRandom(SPECIMEN_SEED)
  return {
    log: specimenLog(day, random),
    settings: { proteinTarget: 135, version: 1 },
    table: specimenTable(day, random)
  }
}
