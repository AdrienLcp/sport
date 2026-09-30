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

/** The first of A to E not yet done this week: suggested, never imposed. */
export const dueSession = (log: Log): Session => {
  const done = doneThisWeek(log)
  return BLOCK_1.find((session) => !done.has(session.id)) ?? SESSIONS.A
}
