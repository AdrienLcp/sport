import type React from 'react'
import { useEffect, useEffectEvent, useState } from 'react'

import { Figure } from '@/features/figures/figure'
import {
  type CooldownDrill,
  type FreeDrill,
  isFree,
  type Session
} from '@/features/program/program-types'
import { ActionButton } from '@/presentation/components/action'
import { FigureFrame, Plate, PlateHead } from '@/presentation/components/plate'
import { useLocalize, useTranslate } from '@/presentation/i18n/i18n-provider'

import { cooldownStops, ledgerState } from './run'
import { formatCount, useElapsed } from './use-elapsed'

type CooldownPlateProps = {
  /** The circuit is already behind: leaving the cool-down closes a whole
      session, never a stopped one. */
  onDone: () => void
  onNext: () => void
  session: Session
  step: number
}

/**
 * One stretch, one plate, the spread of a set. The duration comes from the
 * programme rather than a share of three minutes, the chrono waits for a hand
 * — dropping into a pigeon takes ten seconds of a thirty-second hold — and the
 * figure does not move, because a held stretch is a pure hold.
 */
export const CooldownPlate: React.FC<CooldownPlateProps> = ({
  onDone,
  onNext,
  session,
  step
}) => {
  const stops = cooldownStops(session)
  const stop = stops[Math.min(step, stops.length - 1)]
  const entry = stop === undefined ? undefined : session.cooldown[stop.index]
  const isLast = step >= stops.length - 1

  if (stop === undefined || entry === undefined) return null

  if (isFree(entry)) {
    return <FreePlate drill={entry} onDone={onDone} session={session} />
  }

  return (
    <StretchPlate
      drill={entry}
      index={stop.index}
      key={step}
      onDone={isLast ? onDone : onNext}
      onSkip={isLast ? undefined : onDone}
      position={step}
      session={session}
      side={stop.side}
      total={stops.length}
    />
  )
}

type StretchPlateProps = {
  drill: CooldownDrill
  /** The stretch's place in the cool-down list. */
  index: number
  onDone: () => void
  /** Leaves the cool-down from any stretch but the last. */
  onSkip?: () => void
  /** The plate's place among the cool-down plates, sides unfolded. */
  position: number
  session: Session
  side: 0 | 1
  total: number
}

const StretchPlate: React.FC<StretchPlateProps> = ({
  drill,
  index,
  onDone,
  onSkip,
  position,
  session,
  side,
  total
}) => {
  const translate = useTranslate()
  const localize = useLocalize()
  const seconds = drill.seconds
  const isHeld = seconds !== undefined

  const [isStarted, setIsStarted] = useState(false)
  const isRunning = isHeld && isStarted
  const elapsed = useElapsed(isRunning, `cooldown-${position}`)
  const remaining = seconds === undefined ? 0 : seconds - elapsed

  const finish = useEffectEvent(onDone)

  useEffect(() => {
    if (isRunning && remaining <= 0) finish()
  }, [isRunning, remaining])

  const next = session.cooldown[index + 1]
  // Nothing follows the last stretch, so the plate says nothing: « Next —
  // Session done » two lines above a button reading « Session done » is the
  // same sentence twice.
  const nextLabel =
    drill.perSide === true && side === 0
      ? translate('session.cooldown.otherSide')
      : next === undefined
        ? undefined
        : localize(next.name)

  const actionKey =
    drill.perSide === true && side === 0
      ? 'session.switchSide'
      : next === undefined
        ? 'session.cooldown.finished'
        : 'session.cooldown.nextStretch'

  return (
    <Plate variant='spread'>
      <div className='first-page'>
        <PlateHead
          chrono={
            seconds === undefined
              ? undefined
              : { ratio: isRunning ? remaining / seconds : 1, state: 'set' }
          }
          rank={translate('common.rank', {
            position: String(position + 1),
            total: String(total)
          })}
          title={translate('session.plateTitle', {
            id: session.id,
            name: translate('session.cooldown.name')
          })}
        />

        <div className='aside'>
          <ul className='ledger'>
            {session.cooldown.map((held, place) => {
              const state = ledgerState(place, index)
              return (
                <li data-state={state} key={held.name.en}>
                  <span className='label'>{localize(held.name)}</span>
                  <span className='state'>
                    {state === 'done'
                      ? translate('session.ledger.done')
                      : state === 'live'
                        ? translate('session.ledger.live')
                        : localize(held.detail)}
                  </span>
                </li>
              )
            })}
          </ul>

          {nextLabel !== undefined && (
            <p className='next-up'>
              {translate('session.next')}
              <b>{nextLabel}</b>
            </p>
          )}

          {drill.guard !== undefined && (
            <p className='guard'>{localize(drill.guard)}</p>
          )}
        </div>

        {isHeld && !isRunning ? (
          <ActionButton
            label={translate('session.start')}
            onPress={() => setIsStarted(true)}
          />
        ) : (
          <ActionButton label={translate(actionKey)} onPress={onDone} />
        )}

        {onSkip !== undefined && (
          <div className='exits'>
            <ActionButton
              label={translate('session.cooldown.skip')}
              onPress={onSkip}
              tone='ghost'
            />
          </div>
        )}
      </div>

      <div className='second-page'>
        <FigureFrame isTurning>
          <Figure id={drill.figure} />
        </FigureFrame>

        <div className='movement turning'>
          <h1 className='caption'>{localize(drill.name)}</h1>
          <p className='legend'>
            {seconds === undefined ? (
              <span className='count'>{localize(drill.detail)}</span>
            ) : (
              <>
                <span className='count'>
                  {isRunning ? Math.max(0, Math.ceil(remaining)) : seconds}
                </span>
                <span>{translate('common.unit.seconds')}</span>
              </>
            )}
            {drill.perSide === true && (
              <span className='side'>
                {translate(
                  side === 0 ? 'session.leftSide' : 'session.rightSide'
                )}
              </span>
            )}
          </p>
          <p className='guard'>{localize(drill.cue)}</p>
        </div>
      </div>
    </Plate>
  )
}

type FreePlateProps = {
  drill: FreeDrill
  onDone: () => void
  session: Session
}

/**
 * Five free minutes: the one cool-down entry with no figure, because drawing
 * one would prescribe a movement the programme deliberately leaves open.
 */
const FreePlate: React.FC<FreePlateProps> = ({ drill, onDone, session }) => {
  const translate = useTranslate()
  const localize = useLocalize()
  const elapsed = useElapsed(true, 'cooldown-free')
  const remaining = drill.seconds - elapsed

  return (
    <Plate>
      <PlateHead
        chrono={{ ratio: remaining / drill.seconds, state: 'set' }}
        rank={formatCount(Math.max(0, remaining))}
        title={translate('session.plateTitle', {
          id: session.id,
          name: translate('session.cooldown.name')
        })}
      />

      <div className='body'>
        <h1 className='headline'>{localize(drill.name)}</h1>
        <p className='prose'>{translate('session.free.prose')}</p>

        <div className='divider' />

        <dl className='facts'>
          <dt>{translate('session.title.lengthTerm')}</dt>
          <dd>{translate('session.free.lengthFact')}</dd>
          <dt>{translate('session.free.prescribedTerm')}</dt>
          <dd>{translate('session.free.prescribedFact')}</dd>
          <dt>{translate('session.next')}</dt>
          <dd>{translate('session.free.nextFact')}</dd>
        </dl>
      </div>

      <ActionButton label={translate('session.free.end')} onPress={onDone} />
    </Plate>
  )
}
