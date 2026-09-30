import { isTimed } from '@/features/program/progression'
import { SESSIONS } from '@/features/program/sessions'
import type { Log, SessionEntry } from '@/features/program/training-log'
import { addDays, mondayOf } from '@/helpers/days'

/** How many weeks the curves look back. */
export const PROGRESS_WEEKS = 12

/** A week counts as steady from this many sessions, stopped ones included:
    a turn of five is the programme's rhythm, three is what keeps it moving. */
export const STEADY_WEEK_SESSIONS = 3

export type WeekTally = {
  /** The Monday that opens the calendar week. */
  readonly monday: string
  /** Sessions run to the end. */
  readonly whole: number
  /** Sessions stopped before the end. */
  readonly stopped: number
  /** Repetitions counted, over every set of the week. */
  readonly reps: number
  /** Seconds held, over every timed set of the week. */
  readonly heldSeconds: number
}

const effortOf = (entry: SessionEntry, address: string) =>
  SESSIONS[entry.sessionId].circuit.find(
    (station) => station.address === address
  )?.effort

const volumeOf = (
  entries: readonly SessionEntry[]
): { reps: number; heldSeconds: number } => {
  let reps = 0
  let heldSeconds = 0
  for (const entry of entries) {
    for (const result of entry.results) {
      const effort = effortOf(entry, result.address)
      if (effort === undefined) continue
      if (isTimed(effort)) heldSeconds += result.value
      else reps += result.value
    }
  }
  return { heldSeconds, reps }
}

/** The last `weeks` calendar weeks, oldest first, the current one last. */
export const weeklyTallies = ({
  log,
  today,
  weeks = PROGRESS_WEEKS
}: {
  log: Log
  today: string
  weeks?: number
}): readonly WeekTally[] => {
  const currentMonday = mondayOf(today)
  return Array.from({ length: weeks }, (_, index) =>
    addDays(currentMonday, -7 * (weeks - 1 - index))
  ).map((monday) => {
    const sunday = addDays(monday, 6)
    const inWeek = log.entries.filter(
      (entry) => entry.day >= monday && entry.day <= sunday
    )
    return {
      monday,
      stopped: inWeek.filter((entry) => entry.stopped === true).length,
      whole: inWeek.filter((entry) => entry.stopped !== true).length,
      ...volumeOf(inWeek)
    }
  })
}

const isSteady = (week: WeekTally): boolean =>
  week.whole + week.stopped >= STEADY_WEEK_SESSIONS

export type Regularity = {
  /** Steady weeks in a row, up to now. A current week not yet steady does not
      break the run: it still has days left. */
  readonly currentRun: number
  readonly longestRun: number
  readonly steadyWeeks: number
}

/**
 * Regularity in weeks, never in days: a rest day is part of the programme,
 * and a day streak would punish the one thing it asks for.
 */
export const regularityOf = (weeks: readonly WeekTally[]): Regularity => {
  const current = weeks.at(-1)
  const settled =
    current !== undefined && !isSteady(current) ? weeks.slice(0, -1) : weeks

  let currentRun = 0
  for (const week of settled.toReversed()) {
    if (!isSteady(week)) break
    currentRun += 1
  }

  let longestRun = 0
  let run = 0
  for (const week of weeks) {
    run = isSteady(week) ? run + 1 : 0
    longestRun = Math.max(longestRun, run)
  }

  return {
    currentRun,
    longestRun,
    steadyWeeks: weeks.filter(isSteady).length
  }
}

export type TrainingDay = {
  readonly day: string
  /** `none`, or the best of what that day holds: a whole session beats a stopped one. */
  readonly state: 'future' | 'none' | 'stopped' | 'whole'
}

/** Every day of the last `weeks` weeks, Monday first, week after week. */
export const trainingDays = ({
  log,
  today,
  weeks = PROGRESS_WEEKS
}: {
  log: Log
  today: string
  weeks?: number
}): readonly TrainingDay[] => {
  const first = addDays(mondayOf(today), -7 * (weeks - 1))
  return Array.from({ length: weeks * 7 }, (_, offset): TrainingDay => {
    const day = addDays(first, offset)
    if (day > today) return { day, state: 'future' }
    const onDay = log.entries.filter((entry) => entry.day === day)
    if (onDay.some((entry) => entry.stopped !== true)) {
      return { day, state: 'whole' }
    }
    return { day, state: onDay.length > 0 ? 'stopped' : 'none' }
  })
}
