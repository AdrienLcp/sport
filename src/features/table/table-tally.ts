import { isoDay } from '@/helpers/days'

import { MARKET_IDS, SOURCES } from './table-catalogue'

/**
 * These shapes are what `localStorage` holds under `seance.table.v1` and what a
 * backup file carries: a field renamed here strands what the phone has counted.
 */

/** How many taps of each source were counted, for one day. */
export type DayCount = Readonly<Record<string, number>>

export type Market = {
  /** The Friday that opened the week this list belongs to. */
  readonly week: string
  readonly ticked: readonly string[]
}

export type Table = {
  readonly version: 1
  readonly days: Readonly<Record<string, DayCount>>
  readonly market: Market
}

/** Two weeks of days is everything the plate ever reads back. */
const KEPT_DAYS = 14

export const EMPTY_TABLE: Table = {
  days: {},
  market: { ticked: [], week: '' },
  version: 1
}

/**
 * The week opens on Friday, because that is when the weekend — and the
 * shopping that feeds the next five days — starts. A list ticked on Sunday
 * afternoon is still the list of the week that runs from Friday.
 */
export const weekKeyOf = (date: Date): string => {
  const back = (date.getDay() - 5 + 7) % 7
  return isoDay(
    new Date(date.getFullYear(), date.getMonth(), date.getDate() - back)
  )
}

const pruned = (
  days: Readonly<Record<string, DayCount>>
): Readonly<Record<string, DayCount>> =>
  Object.fromEntries(
    Object.entries(days)
      .toSorted(([a], [b]) => a.localeCompare(b))
      .slice(-KEPT_DAYS)
  )

const PROTEIN_OF = new Map(SOURCES.map((source) => [source.id, source.protein]))

export const proteinOf = (count: DayCount | undefined): number => {
  if (count === undefined) return 0
  return Object.entries(count).reduce(
    (total, [id, taps]) => total + (PROTEIN_OF.get(id) ?? 0) * taps,
    0
  )
}

/** A tap counts a portion; the pair of targets beside it only corrects. */
export const countSource = ({
  day,
  delta,
  id,
  table
}: {
  day: string
  delta: number
  id: string
  table: Table
}): Table => {
  const current = table.days[day] ?? {}
  const taps = Math.max(0, (current[id] ?? 0) + delta)
  const next = Object.fromEntries(
    taps === 0
      ? Object.entries(current).filter(([source]) => source !== id)
      : Object.entries({ ...current, [id]: taps })
  )

  return { ...table, days: pruned({ ...table.days, [day]: next }) }
}

/** Days before `day`, most recent first, with what each one counted. */
export const runUpTo = (
  table: Table,
  day: string
): readonly { day: string; protein: number }[] =>
  Object.entries(table.days)
    .filter(([stored]) => stored < day)
    .toSorted(([a], [b]) => b.localeCompare(a))
    .map(([stored, count]) => ({ day: stored, protein: proteinOf(count) }))

/** Ids the catalogue no longer holds are forgotten: counted, they push a
    tally past the list's own length and "la liste est faite", which compares
    the two, never lights up again. */
export const inCatalogue = (ticked: readonly string[]): readonly string[] =>
  ticked.filter((id) => MARKET_IDS.has(id))

/** A list from a spent week is an empty list: the same items come back. */
export const marketOf = (table: Table, week: string): readonly string[] =>
  table.market.week === week ? inCatalogue(table.market.ticked) : []

export const tickItem = ({
  id,
  table,
  week
}: {
  id: string
  table: Table
  week: string
}): Table => {
  const ticked = marketOf(table, week)
  const next = ticked.includes(id)
    ? ticked.filter((current) => current !== id)
    : [...ticked, id]
  return { ...table, market: { ticked: next, week } }
}

export const clearMarket = (table: Table, week: string): Table => ({
  ...table,
  market: { ticked: [], week }
})
