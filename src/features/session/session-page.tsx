import { useScreenAwake } from '@adrienlcp/browser/react'
import type React from 'react'
import { useState } from 'react'

import type { Session, SessionId } from '@/features/program/program-types'
import { sessionAtWeek } from '@/features/program/progression'
import { doneThisWeek, dueSession, weekOf } from '@/features/program/schedule'
import { SESSIONS } from '@/features/program/sessions'
import { readTrainingLogOrEmpty } from '@/features/program/use-training-log'
import { isoDay } from '@/helpers/days'
import { useChildPage } from '@/infrastructure/router/navigation'
import { readRunSnapshot } from '@/infrastructure/storage/session-run-storage'

import { CooldownPlate } from './cooldown-plate'
import { DonePlate } from './done-plate'
import { RestPlate } from './rest-plate'
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
  today: Date
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
  const run = useSessionRun({ session, today, week })
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
          isCalibration={run.isCalibration}
          onPick={onPick}
          onStart={() => run.dispatch({ type: 'begin' })}
          session={session}
          today={today}
          week={week}
        />
      )
  }
}

type Turn = {
  readonly done: ReadonlySet<SessionId>
  readonly due: Session
  readonly week: number
}

const readTurn = (): Turn => {
  const log = readTrainingLogOrEmpty()
  return { done: doneThisWeek(log), due: dueSession(log), week: weekOf(log) }
}

/** A session interrupted today reopens where it stood; otherwise, the one due. */
const openingSession = (due: Session, today: Date): Session => {
  const read = readRunSnapshot()
  if (read.status === 'failure' || read.data === null) return due
  return read.data.day === isoDay(today) ? SESSIONS[read.data.sessionId] : due
}

/**
 * The front door: the five sessions, the one due picked by default, any other
 * a tap away. It stays mounted under the report it opens, so the way back
 * finds the plate it left.
 */
export const SessionPage: React.FC = () => {
  const [today] = useState(() => new Date())
  const [turn, setTurn] = useState(readTurn)
  const [picked, setPicked] = useState(() => openingSession(turn.due, today))
  const childPage = useChildPage()

  const moveOn = () => {
    const next = readTurn()
    setTurn(next)
    setPicked(next.due)
  }

  return (
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
  )
}
