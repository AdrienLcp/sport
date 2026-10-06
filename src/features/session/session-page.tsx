import type React from 'react'
import { useState } from 'react'

import type { Session, SessionId } from '@/features/program/program-types'
import { sessionAtWeek } from '@/features/program/progression'
import { doneThisWeek, dueSession, weekOf } from '@/features/program/schedule'
import { SESSIONS } from '@/features/program/sessions'
import { readTrainingLogOrEmpty } from '@/features/program/use-training-log'
import { useScreenAwake } from '@/infrastructure/browser'
import { useChildPage } from '@/infrastructure/router/navigation'
import { readRunSnapshot } from '@/infrastructure/storage/session-run-storage'
import { useToday } from '@/presentation/clock/use-today'
import { ScreenTitle } from '@/presentation/head/screen-title'

import { salvageAbandonedRun } from './abandoned-run'
import { CooldownPlate } from './cooldown-plate'
import { DonePlate } from './done-plate'
import { RestPlate } from './rest-plate'
import { canUndoSet } from './run'
import { SetPlate } from './set-plate'
import { TitlePlate } from './title-plate'
import { useSessionRun } from './use-session-run'
import { WarmupPlate } from './warmup-plate'

type SessionRunProps = {
  /** A page opened over the session — the report — shown in its place. */
  childPage: React.ReactNode
  done: ReadonlySet<SessionId>
  due: Session
  /** The done plate closed: the log has moved on, and so has the session due. */
  onClose: () => void
  onPick: (session: Session) => void
  session: Session
  today: string
  week: number
}

/**
 * The session's state machine, one plate per stage. It runs the session as
 * this week has it: the rounds ramp is applied once, here, and every plate
 * below reads its round count from the session it is handed.
 */
const SessionRun: React.FC<SessionRunProps> = ({
  childPage,
  done,
  due,
  onClose,
  onPick,
  session: planned,
  today,
  week
}) => {
  const session = sessionAtWeek(planned, week)
  const run = useSessionRun({ day: today, session, week })
  const { state } = run
  // A phone propped against a wall must not go dark in the middle of a set.
  useScreenAwake(state.stage !== 'title' && state.stage !== 'done')

  if (childPage !== null) return childPage

  switch (state.stage) {
    case 'warmup':
      return (
        <WarmupPlate
          index={state.step}
          key={state.step}
          onDone={() => run.dispatch({ type: 'endDrill' })}
          session={session}
        />
      )
    case 'set':
      return (
        <SetPlate
          day={run.day}
          isCalibration={run.isCalibration}
          key={`${state.step}-${state.side}`}
          log={run.log}
          onBack={
            canUndoSet(state)
              ? () => run.dispatch({ type: 'undoSet' })
              : undefined
          }
          onDone={(value, elapsed) =>
            run.dispatch({ elapsed, type: 'completeSet', value })
          }
          onStop={() => run.dispatch({ type: 'endCircuitEarly' })}
          session={session}
          side={state.side}
          step={state.step}
          week={run.week}
        />
      )
    case 'rest':
      return (
        <RestPlate
          log={run.log}
          onBack={() => run.dispatch({ type: 'undoSet' })}
          onDone={() => run.dispatch({ type: 'endRest' })}
          onStop={() => run.dispatch({ type: 'endCircuitEarly' })}
          seconds={state.restSeconds}
          session={session}
          step={state.step}
          week={run.week}
        />
      )
    case 'cooldown':
      return (
        <CooldownPlate
          onDone={() => run.commit(state.isCutShort === true)}
          onNext={() => run.dispatch({ type: 'nextStretch' })}
          session={session}
          step={state.step}
        />
      )
    case 'done':
      return (
        <DonePlate
          day={run.day}
          isStopped={run.isStopped}
          log={run.logBefore ?? run.log}
          onClose={() => {
            run.close()
            onClose()
          }}
          results={state.results}
          session={session}
          week={run.week}
        />
      )
    case 'title':
      return (
        <TitlePlate
          done={done}
          due={due}
          onMeasure={() => run.dispatch({ isMeasuring: true, type: 'begin' })}
          onPick={onPick}
          onStart={() => run.dispatch({ type: 'begin' })}
          session={session}
          week={week}
        />
      )
  }
}

type Turn = {
  readonly done: ReadonlySet<SessionId>
  /** The last session run, when it ran today. */
  readonly doneToday?: SessionId
  readonly due: Session
  readonly week: number
}

const readTurn = (today: string): Turn => {
  const log = readTrainingLogOrEmpty()
  const last = log.entries.at(-1)
  return {
    done: doneThisWeek(log),
    doneToday: last?.day === today ? last.sessionId : undefined,
    due: dueSession(log),
    week: weekOf(log)
  }
}

/**
 * A session interrupted today reopens where it stood; one finished today
 * leaves the menu with nothing picked; otherwise, the one due.
 */
const openingSession = (turn: Turn, today: string): Session | null => {
  const read = readRunSnapshot()
  if (read.status === 'success' && read.data?.day === today) {
    return SESSIONS[read.data.sessionId]
  }
  return turn.doneToday === undefined ? turn.due : null
}

/**
 * The front door: the five sessions, the one due picked by default, any other
 * a tap away. It stays mounted under the report it opens, so the way back
 * finds the plate it left.
 */
export const SessionPage: React.FC = () => {
  const today = useToday()
  const [turn, setTurn] = useState(() => {
    salvageAbandonedRun(today)
    return readTurn(today)
  })
  const [picked, setPicked] = useState(() => openingSession(turn, today))
  const childPage = useChildPage()

  const moveOn = () => {
    setTurn(readTurn(today))
    setPicked(null)
  }

  return (
    <>
      {childPage === null && <ScreenTitle screen='app' />}
      {picked === null ? (
        (childPage ?? (
          <TitlePlate
            done={turn.done}
            doneToday={turn.doneToday}
            due={turn.due}
            onMeasure={() => undefined}
            onPick={setPicked}
            onStart={() => undefined}
            session={null}
            week={turn.week}
          />
        ))
      ) : (
        <SessionRun
          childPage={childPage}
          done={turn.done}
          due={turn.due}
          key={picked.id}
          onClose={moveOn}
          onPick={setPicked}
          session={picked}
          today={today}
          week={turn.week}
        />
      )}
    </>
  )
}
