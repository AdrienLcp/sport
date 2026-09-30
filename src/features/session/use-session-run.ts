import { useEffect, useReducer, useState } from 'react'

import type { Session } from '@/features/program/program-types'
import {
  hasHistory,
  type Log,
  type SessionEntry
} from '@/features/program/training-log'
import { useTrainingLog } from '@/features/program/use-training-log'
import { noteSessionRun } from '@/features/reminders/reminder-device'
import { isoDay } from '@/helpers/days'
import {
  clearRunSnapshot,
  readRunSnapshot,
  writeRunSnapshot
} from '@/infrastructure/storage/session-run-storage'
import { readActiveProfile } from '@/infrastructure/storage/storage-profile'

import { INITIAL_RUN, type RunAction, type RunState, runReducer } from './run'

/** Today's snapshot of this session, or the title plate. */
const restoreRun = ({
  day,
  session
}: {
  day: string
  session: Session
}): RunState => {
  const read = readRunSnapshot()
  if (read.status === 'failure') {
    console.warn(`The interrupted session could not be read (${read.error}).`)
    return INITIAL_RUN
  }

  const snapshot = read.data
  if (
    snapshot === null ||
    snapshot.day !== day ||
    snapshot.sessionId !== session.id
  ) {
    return INITIAL_RUN
  }
  return {
    firstSide: snapshot.firstSide,
    isCutShort: snapshot.isCutShort,
    restSeconds: snapshot.restSeconds,
    results: snapshot.results,
    side: snapshot.side,
    stage: snapshot.stage,
    step: snapshot.step
  }
}

const warnOnFailure = (
  outcome: { status: 'failure'; error: string } | { status: 'success' },
  what: string
): void => {
  if (outcome.status === 'failure') {
    console.warn(`${what} (${outcome.error}).`)
  }
}

/**
 * The session due: where it stands, what the log already holds, and the hand
 * that writes it down. Lives in the page, above the plates, so a page opened
 * on top of it — the report — finds it untouched on the way back.
 */
export const useSessionRun = ({
  session,
  today,
  week
}: {
  session: Session
  today: Date
  week: number
}) => {
  const day = isoDay(today)
  const [log, keepLog] = useTrainingLog()
  const [logBefore, setLogBefore] = useState<Log | null>(null)
  const [isStopped, setIsStopped] = useState(false)
  const [state, dispatch] = useReducer(
    (current: RunState, action: RunAction) =>
      runReducer(session, current, action),
    undefined,
    () => restoreRun({ day, session })
  )

  const isCalibration = !hasHistory(log)

  // An address survives a closed tab: the run is written down as it happens.
  useEffect(() => {
    if (state.stage === 'title' || state.stage === 'done') return
    warnOnFailure(
      writeRunSnapshot({
        day,
        firstSide: state.firstSide,
        isCutShort: state.isCutShort,
        restSeconds: state.restSeconds,
        results: state.results,
        sessionId: session.id,
        side: state.side,
        stage: state.stage,
        step: state.step
      }),
      'The session could not be saved as it ran'
    )
  }, [state, day, session.id])

  /**
   * Written down by the hand that leaves the session, not by an effect
   * watching for it: ending the cool-down and stopping in the middle both land
   * here — ten sets really done are ten sets, and a tab closed on the way used
   * to record none of them.
   */
  const commit = (isCutShort: boolean) => {
    warnOnFailure(
      clearRunSnapshot(),
      'The interrupted session could not be cleared'
    )
    const calibrated = session.circuit.find(
      (station) => station.calibrated === true
    )
    const pushUps =
      calibrated === undefined
        ? undefined
        : state.results
            .filter((result) => result.address === calibrated.address)
            .reduce<number | undefined>(
              (best, result) =>
                best === undefined
                  ? result.value
                  : Math.max(best, result.value),
              undefined
            )

    const entry: SessionEntry = isCutShort
      ? {
          day,
          results: state.results,
          sessionId: session.id,
          stopped: true,
          week
        }
      : { day, results: state.results, sessionId: session.id, week }

    if (readActiveProfile() === 'own') void noteSessionRun(day)
    setIsStopped(isCutShort)
    setLogBefore(log)
    keepLog({
      ...log,
      entries: [...log.entries, entry],
      pushUpTest: log.pushUpTest ?? pushUps
    })
    dispatch({ type: isCutShort ? 'stop' : 'endCooldown' })
  }

  const close = () => {
    setIsStopped(false)
    dispatch({ type: 'restart' })
  }

  return {
    close,
    commit,
    day,
    dispatch,
    isCalibration,
    isStopped,
    log,
    logBefore,
    state,
    week
  }
}
