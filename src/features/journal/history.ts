import { MOVEMENTS } from '@programme/movements'
import { BLOCK_1 } from '@programme/program'

import type { Session } from '@/features/program/program-types'
import { isTimed } from '@/features/program/progression'
import {
  type Log,
  movementOf,
  type SessionEntry
} from '@/features/program/training-log'
import type { LocalizedText } from '@/helpers/localized-text'

export type TallyRow = {
  readonly address: string
  readonly name: LocalizedText
  readonly timed: boolean
  /** Best set of that week, undefined where the session did not run. */
  readonly byWeek: readonly (number | undefined)[]
}

export type TallyBlock = {
  readonly session: Session
  readonly runs: number
  /** How many of those runs were stopped before the end. */
  readonly cutShort: number
  readonly rows: readonly TallyRow[]
}

export const weeksPresent = (log: Log): readonly number[] =>
  [...new Set(log.entries.map((entry) => entry.week))].toSorted((a, b) => a - b)

const bestAt = ({
  address,
  entries,
  week
}: {
  address: string
  entries: readonly SessionEntry[]
  week: number
}): number | undefined => {
  const values = entries
    .filter((entry) => entry.week === week)
    .flatMap((entry) =>
      entry.results
        .filter((result) => result.address === address)
        .map((result) => result.value)
    )
  return values.length === 0 ? undefined : Math.max(...values)
}

/** Sessions in program order, never in the order they happened to be run. */
export const tally = (log: Log): readonly TallyBlock[] => {
  const weeks = weeksPresent(log)

  return BLOCK_1.flatMap((session) => {
    const entries = log.entries.filter(
      (entry) => entry.sessionId === session.id
    )
    if (entries.length === 0) return []

    const rows = session.circuit.map((station) => ({
      address: station.address,
      byWeek: weeks.map((week) =>
        bestAt({ address: station.address, entries, week })
      ),
      name: MOVEMENTS[movementOf(station, log)].name,
      timed: isTimed(station.effort)
    }))

    return [
      {
        cutShort: entries.filter((entry) => entry.stopped === true).length,
        rows,
        runs: entries.length,
        session
      }
    ]
  })
}
