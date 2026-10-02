import { MOVEMENTS } from '@programme/movements'

import { isTimed } from '@/features/program/progression'
import { SESSIONS } from '@/features/program/sessions'
import {
  type Log,
  type Measure,
  movementOf,
  type SessionEntry
} from '@/features/program/training-log'
import { SOURCES } from '@/features/table/table-catalogue'
import {
  type DayCount,
  proteinOf,
  type Table,
  weekKeyOf
} from '@/features/table/table-tally'
import { type IsoDay, plainDayOf } from '@/helpers/days'
import { type Locale, textIn } from '@/helpers/localized-text'
import { toFormattableDate } from '@/presentation/i18n/formattable-date'
import type { Translate } from '@/presentation/i18n/translation'

/*
 * The account of what the app holds, as Markdown to paste into the reader's
 * own notes. The app has no backend and never will: it writes the text and
 * hands it over. The Markdown syntax is the format, not copy, so it stays here.
 */

/** The evening that just ended, or everything the app has kept. */
export type ReportScope = 'all' | 'evening'

export type Report = {
  readonly text: string
  readonly sessions: number
  readonly measures: number
  readonly days: number
}

/** What the report is written for: the words, their language, the target counted toward. */
type Writing = {
  readonly locale: Locale
  readonly proteinTarget: number
  readonly translate: Translate
}

const newestFirst = <T extends { readonly day: string }>(
  items: readonly T[]
): readonly T[] => items.toSorted((a, b) => b.day.localeCompare(a.day))

/**
 * One entry per session. What the app measured is filled in; how it felt and
 * what changes are left open, because a journal that guesses those is a
 * journal nobody can trust afterwards.
 */
const sessionEntry = ({
  entry,
  log,
  writing: { locale, translate }
}: {
  entry: SessionEntry
  log: Log
  writing: Writing
}): string => {
  const session = SESSIONS[entry.sessionId]

  const done = session.circuit.map((station) => {
    const values = entry.results
      .filter((result) => result.address === station.address)
      .toSorted((a, b) => a.round - b.round)
      .map((result) =>
        isTimed(station.effort)
          ? translate('common.seconds', { count: String(result.value) })
          : String(result.value)
      )

    return translate('report.document.movement', {
      name: textIn(MOVEMENTS[movementOf(station, log)].name, locale),
      values:
        values.length === 0
          ? translate('report.document.notDone')
          : values.join(' · ')
    })
  })

  const headingKey =
    entry.stopped === true
      ? 'report.document.sessionStopped'
      : 'report.document.session'

  return [
    translate(headingKey, {
      day: entry.day,
      id: session.id,
      name: textIn(session.name, locale)
    }),
    translate('report.document.done'),
    ...done,
    translate('report.document.feeling'),
    translate('report.document.adjustment')
  ].join('\n')
}

/** The readings as a Markdown table, newest first. */
const measureTable = ({
  measures,
  translate
}: {
  measures: readonly Measure[]
  translate: Translate
}): string =>
  [
    `| ${translate('report.document.measureHeader')} |`,
    '| --- | --- | --- |',
    ...measures.map(
      (measure) =>
        `| ${measure.day} | ${
          measure.weight === undefined
            ? ''
            : translate('report.document.kilograms', { value: measure.weight })
        } | ${
          measure.waist === undefined
            ? ''
            : translate('report.document.centimetres', { value: measure.waist })
        } |`
    )
  ].join('\n')

const counted = (count: DayCount, { locale, translate }: Writing): string => {
  const taken = SOURCES.flatMap((source) => {
    const taps = count[source.id] ?? 0
    return taps > 0
      ? [
          translate('report.document.portions', {
            count: String(taps),
            name: textIn(source.name, locale)
          })
        ]
      : []
  })
  return taken.length === 0 ? translate('common.none') : taken.join(' · ')
}

/**
 * Grouped by the week the table itself uses, which opens on Friday. A block
 * per week is what survives being pasted every few days: the blocks stack in
 * the reader's notes instead of overwriting a table the app has already
 * forgotten — it keeps fourteen days, the notes keep everything.
 */
const proteinWeeks = ({
  days,
  table,
  writing
}: {
  days: readonly string[]
  table: Table
  writing: Writing
}): string => {
  const { translate } = writing
  const weeks = new Map<string, string[]>()

  for (const day of days) {
    const week = weekKeyOf(day)
    const rows = weeks.get(week) ?? []
    rows.push(
      `| ${day} | ${translate('report.document.grams', {
        value: proteinOf(table.days[day])
      })} | ${counted(table.days[day] ?? {}, writing)} |`
    )
    weeks.set(week, rows)
  }

  return [...weeks.entries()]
    .map(([week, rows]) => {
      const totals = days
        .filter((day) => weekKeyOf(day) === week)
        .map((day) => proteinOf(table.days[day]))
      const mean = totals.reduce((sum, value) => sum + value, 0) / totals.length

      return [
        translate('report.document.proteinWeek', {
          week: toFormattableDate(plainDayOf(week))
        }),
        '',
        `| ${translate('report.document.proteinHeader')} |`,
        '| --- | --- | --- |',
        ...rows,
        '',
        translate('report.document.proteinMean', {
          days: totals.length,
          mean,
          target: String(writing.proteinTarget)
        })
      ].join('\n')
    })
    .join('\n\n')
}

export const buildReport = ({
  log,
  scope,
  table,
  today,
  writing
}: {
  log: Log
  scope: ReportScope
  table: Table
  today: IsoDay
  writing: Writing
}): Report => {
  const { translate } = writing
  const day = today
  const inScope = <T extends { readonly day: string }>(
    items: readonly T[]
  ): readonly T[] =>
    scope === 'all' ? items : items.filter((item) => item.day === day)

  const entries = newestFirst(inScope(log.entries))
  const measures = newestFirst(inScope(log.measures ?? []))
  const days = Object.keys(table.days)
    .filter((stored) => scope === 'all' || stored === day)
    .toSorted((a, b) => b.localeCompare(a))

  const blocks: string[] = [
    translate('report.document.title', {
      date: toFormattableDate(plainDayOf(today))
    }),
    translate(
      scope === 'evening'
        ? 'report.document.introEvening'
        : 'report.document.introAll'
    )
  ]

  if (entries.length > 0) {
    blocks.push(
      translate('report.document.sessionsHeading'),
      ...entries.map((entry) => sessionEntry({ entry, log, writing }))
    )
  }

  if (measures.length > 0) {
    blocks.push(
      translate('report.document.measuresHeading'),
      measureTable({ measures, translate })
    )
  }

  if (days.length > 0) {
    blocks.push(
      translate('report.document.proteinHeading'),
      proteinWeeks({ days, table, writing })
    )
  }

  return {
    days: days.length,
    measures: measures.length,
    sessions: entries.length,
    text: `${blocks.join('\n\n')}\n`
  }
}

export const isEmptyReport = (report: Report): boolean =>
  report.sessions === 0 && report.measures === 0 && report.days === 0
