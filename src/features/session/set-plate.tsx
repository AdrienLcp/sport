import { MOVEMENTS } from '@programme/movements'
import type React from 'react'
import { useState } from 'react'

import { Figure } from '@/features/figures/figure'
import { isPaced } from '@/features/figures/motion'
import type { Session } from '@/features/program/program-types'
import {
  DEFAULT_TEMPO,
  isPerSide,
  isTimed,
  targetFor
} from '@/features/program/progression'
import {
  type Log,
  movementOf,
  numberToBeat
} from '@/features/program/training-log'
import { ActionButton } from '@/presentation/components/action'
import { Button } from '@/presentation/components/button'
import { FigureFrame, Plate, PlateHead } from '@/presentation/components/plate'
import { useLocalize, useTranslate } from '@/presentation/i18n/i18n-provider'
import { bold, RichText } from '@/presentation/i18n/rich-text'

import { CueList } from './cue-list'
import { indexOf, ledgerState, roundOf, roundsOf, stationAt } from './run'
import { TimeUp } from './time-up'
import { useElapsed } from './use-elapsed'

import './set-plate.sass'

type SetPlateProps = {
  day: string
  /** No history yet: no target, no number to beat, the count is measured. */
  isCalibration: boolean
  log: Log
  /** Absent on the first set, where there is nothing to step back to. */
  onBack?: () => void
  /** `value` is the reps counted or the whole seconds held. */
  onDone: (value: number, elapsed: number) => void
  onStop: () => void
  session: Session
  /** A timed per-side hold runs twice; 0 is the left side. */
  side: 0 | 1
  step: number
  week: number
}

export const SetPlate: React.FC<SetPlateProps> = ({
  day,
  isCalibration,
  log,
  onBack,
  onDone,
  onStop,
  session,
  side,
  step,
  week
}) => {
  const translate = useTranslate()
  const localize = useLocalize()
  const station = stationAt(session, step)
  const movementId = movementOf(station, log)
  const movement = MOVEMENTS[movementId]
  const round = roundOf(session, step)
  const index = indexOf(session, step)
  const rounds = roundsOf(session)

  const timed = isTimed(station.effort)
  const perSide = isPerSide(station.effort)
  const target = targetFor(station.effort, week)
  const beat = isCalibration
    ? undefined
    : numberToBeat({
        address: station.address,
        log,
        round,
        sessionId: session.id,
        today: day
      })

  const [count, setCount] = useState(
    isCalibration ? station.effort.from : target
  )

  // The chrono does not start on arrival: the reader has a cue to read and a
  // figure playing the gesture, and the time only runs once they say so.
  const key = `${step}-${side}`
  const [startedKey, setStartedKey] = useState<string | null>(null)
  const isRunning = timed && startedKey === key
  const elapsed = useElapsed(isRunning, key)

  const remaining = target - elapsed
  const chrono =
    timed && !isCalibration
      ? ({ ratio: isRunning ? remaining / target : 1, state: 'set' } as const)
      : undefined

  const shown = timed
    ? isCalibration
      ? Math.floor(elapsed)
      : !isRunning
        ? target
        : remaining > 0
          ? Math.ceil(remaining)
          : Math.floor(elapsed - target)
    : count

  const unit = timed
    ? translate('common.unit.seconds')
    : translate(count === 1 ? 'common.unit.rep' : 'common.unit.reps')
  const isOvertime = timed && !isCalibration && isRunning && remaining <= 0

  const next = session.circuit[index + 1]
  const nextLabel =
    next !== undefined
      ? localize(MOVEMENTS[movementOf(next, log)].name)
      : round < rounds
        ? translate('session.set.restThenRound', { round: String(round + 1) })
        : translate('session.set.stretches')

  const finish = () =>
    onDone(timed ? Math.max(0, Math.round(elapsed)) : count, elapsed)

  const ledgerLabel = (
    position: number,
    entryTarget: number,
    entryTimed: boolean
  ) => {
    const state = ledgerState(position, index)
    if (state === 'done') return translate('session.ledger.done')
    if (state === 'live') return translate('session.ledger.live')
    if (isCalibration) return translate('common.none')
    return entryTimed
      ? translate('common.seconds', { count: String(entryTarget) })
      : String(entryTarget)
  }

  return (
    <Plate className='set-plate' variant='spread'>
      <div className='first-page'>
        <PlateHead
          chrono={chrono}
          rank={translate('common.rank', {
            position: String(index + 1),
            total: String(session.circuit.length)
          })}
          title={translate('session.plateTitle', {
            id: session.id,
            name: localize(session.name)
          })}
        />

        <div className='aside'>
          <ul className='ledger'>
            {session.circuit.map((entry, position) => (
              <li data-state={ledgerState(position, index)} key={entry.address}>
                <span className='address'>{entry.address}</span>
                <span className='label'>
                  {localize(MOVEMENTS[movementOf(entry, log)].name)}
                </span>
                <span className='state'>
                  {ledgerLabel(
                    position,
                    targetFor(entry.effort, week),
                    isTimed(entry.effort)
                  )}
                </span>
              </li>
            ))}
          </ul>

          <p className='rounds'>
            <span>{translate('session.set.round')}</span>
            {Array.from({ length: rounds }, (_, position) => position).map(
              (position) => (
                <i data-on={position < round} key={`round-${position + 1}`} />
              )
            )}
            <span className='rank'>
              {translate('common.rank', {
                position: String(round),
                total: String(rounds)
              })}
            </span>
          </p>

          <p className='next-up'>
            {translate('session.next')}
            <b>{nextLabel}</b>
          </p>

          {movement.guard !== undefined && (
            <p className='guard'>{localize(movement.guard)}</p>
          )}
        </div>

        {timed && !isRunning ? (
          <ActionButton
            label={translate('session.start')}
            onPress={() => setStartedKey(key)}
          />
        ) : (
          <ActionButton
            label={translate(
              perSide && timed && side === 0
                ? 'session.switchSide'
                : 'session.set.done'
            )}
            onPress={finish}
          />
        )}

        <div className='exits'>
          {onBack !== undefined && (
            <ActionButton
              label={translate('session.previousSet')}
              onPress={onBack}
              tone='ghost'
            />
          )}
          <ActionButton
            label={translate('session.stop')}
            onPress={onStop}
            tone='ghost'
          />
        </div>
      </div>

      <div className='second-page'>
        <FigureFrame isTurning>
          <Figure id={movement.figure} tempo={movement.tempo} />
        </FigureFrame>

        <div className='movement turning'>
          <h1 className='caption'>{localize(movement.name)}</h1>
          <p className='legend' data-overtime={isOvertime || undefined}>
            {timed ? (
              <span className='count'>
                {isOvertime ? translate('session.set.overtime') : ''}
                {shown}
              </span>
            ) : (
              <>
                <Button
                  aria-label={translate('session.set.fewer')}
                  className='step'
                  isDisabled={count === 0}
                  onPress={() => setCount((value) => Math.max(0, value - 1))}
                >
                  {translate('common.minus')}
                </Button>
                <span className='count'>{count}</span>
                <Button
                  aria-label={translate('session.set.more')}
                  className='step'
                  onPress={() => setCount((value) => value + 1)}
                >
                  {translate('common.plus')}
                </Button>
              </>
            )}
            <span>{unit}</span>
            {isCalibration && (
              <span className='side'>{translate('session.set.toMeasure')}</span>
            )}
            {perSide && (
              <span className='side'>
                {timed
                  ? translate(
                      side === 0 ? 'session.leftSide' : 'session.rightSide'
                    )
                  : translate('session.set.perSide')}
              </span>
            )}
            {beat !== undefined && (
              <span className='prev'>
                <RichText
                  parts={translate.rich('session.set.lastWeek', {
                    b: bold,
                    beat: String(beat)
                  })}
                />
              </span>
            )}
          </p>
          <TimeUp isUp={isOvertime} />
          <CueList
            cues={movement.cues}
            setup={movement.setup}
            stop={timed ? undefined : isCalibration ? 'calibration' : 'reserve'}
            support={movement.support}
            tempo={
              isPaced(movement.figure)
                ? (movement.tempo ?? DEFAULT_TEMPO)
                : undefined
            }
          />
        </div>
      </div>
    </Plate>
  )
}
