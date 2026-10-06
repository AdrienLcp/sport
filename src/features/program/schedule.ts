import { BLOCK_1 } from '@programme/program'

import type { Session, SessionId } from './program-types'
import { SESSIONS } from './sessions'
import type { Log } from './training-log'

const sessionsIn = (log: Log, week: number): ReadonlySet<SessionId> =>
  new Set(
    log.entries
      .filter((entry) => entry.week === week)
      .map((entry) => entry.sessionId)
  )

/**
 * The block week the next session belongs to: the latest one written, until
 * A to E are all in it. A week is a turn through the five, never the calendar,
 * and a session stopped before the end still counts in it.
 */
export const weekOf = (log: Log): number => {
  const latest = Math.max(1, ...log.entries.map((entry) => entry.week))
  return sessionsIn(log, latest).size === BLOCK_1.length ? latest + 1 : latest
}

export const doneThisWeek = (log: Log): ReadonlySet<SessionId> =>
  sessionsIn(log, weekOf(log))

/**
 * The one after the last session run, skipping those already done this week:
 * suggested, never imposed. Picking C first leads on to D, not back to A.
 */
export const dueSession = (log: Log): Session => {
  const done = doneThisWeek(log)
  const last = log.entries.at(-1)?.sessionId
  const start = BLOCK_1.findIndex((session) => session.id === last) + 1
  const inTurn = [...BLOCK_1.slice(start), ...BLOCK_1.slice(0, start)]
  return inTurn.find((session) => !done.has(session.id)) ?? SESSIONS.A
}
