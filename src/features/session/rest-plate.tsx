import { MOVEMENTS } from '@programme/movements'
import type React from 'react'
import { useEffect, useEffectEvent } from 'react'

import type { Session } from '@/features/program/program-types'
import { isTimed, targetFor } from '@/features/program/progression'
import { type Log, movementOf } from '@/features/program/training-log'
import { ActionButton } from '@/presentation/components/action'
import { Plate, PlateHead } from '@/presentation/components/plate'
import { useLocalize, useTranslate } from '@/presentation/i18n/i18n-provider'

import { roundOf, roundsOf, stationAt } from './run'
import { useClockTones } from './use-clock-tones'
import { formatCount, useElapsed } from './use-elapsed'

import './rest-plate.sass'

type RestPlateProps = {
  log: Log
  /** Called once the rest has run out, or when the reader skips it. */
  /** Takes back the set that closed the round, and shows its plate again. */
  onBack: () => void
  onDone: () => void
  onStop: () => void
  seconds: number
  session: Session
  /** The step the rest leads into. */
  step: number
  week: number
}

export const RestPlate: React.FC<RestPlateProps> = ({
  log,
  onBack,
  onDone,
  onStop,
  seconds,
  session,
  step,
  week
}) => {
  const translate = useTranslate()
  const localize = useLocalize()
  const { seconds: elapsed } = useElapsed(true, `rest-${step}`)
  const remaining = seconds - elapsed
  useClockTones(true, remaining)
  const station = stationAt(session, step)
  const movement = MOVEMENTS[movementOf(station, log)]
  const target = targetFor(station.effort, week)

  const finish = useEffectEvent(onDone)

  useEffect(() => {
    if (remaining <= 0) finish()
  }, [remaining])

  return (
    <Plate className='rest-plate'>
      <PlateHead
        chrono={{
          ratio: remaining / seconds,
          run: { key: `rest-${step}`, secondsLeft: remaining },
          state: 'rest'
        }}
        rank={translate('session.rest.round', {
          round: String(roundOf(session, step)),
          rounds: String(roundsOf(session))
        })}
        title={translate('session.plateTitle', {
          id: session.id,
          name: translate('session.rest.name')
        })}
      />

      <div className='countdown'>
        <span className='label'>{translate('session.rest.name')}</span>
        <p className='time'>{formatCount(remaining)}</p>
      </div>

      <p className='next-up'>
        {translate('session.next')}
        <b>
          {translate('session.rest.nextSet', {
            effort: isTimed(station.effort)
              ? translate('common.seconds', { count: String(target) })
              : String(target),
            name: localize(movement.name)
          })}
        </b>
      </p>

      <ActionButton
        label={translate('session.rest.skip')}
        onPress={onDone}
        tone='ghost'
      />
      <div className='exits'>
        <ActionButton
          label={translate('session.previousSet')}
          onPress={onBack}
          tone='ghost'
        />
        <ActionButton
          label={translate('session.stop')}
          onPress={onStop}
          tone='ghost'
        />
      </div>
    </Plate>
  )
}
