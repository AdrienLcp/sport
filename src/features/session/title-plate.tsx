import { BLOCK_1 } from '@programme/program'
import type React from 'react'

import type { Session, SessionId } from '@/features/program/program-types'
import { capitalize } from '@/helpers/text'
import {
  journalPathFor,
  progressPathFor,
  settingsPathFor,
  tablePathFor
} from '@/infrastructure/router/navigation'
import { useWallMinute } from '@/presentation/clock/use-wall-minute'
import { ActionButton, ActionLink } from '@/presentation/components/action'
import { Plate, PlateHead } from '@/presentation/components/plate'
import { Radio, RadioGroup } from '@/presentation/components/radio-group'
import { toFormattableDate } from '@/presentation/i18n/formattable-date'
import { useLocalize, useTranslate } from '@/presentation/i18n/i18n-provider'

import { sessionMinutes } from './session-length'

import './title-plate.sass'

type TitlePlateProps = {
  /** Already run this block week, whole or stopped. */
  done: ReadonlySet<SessionId>
  /** The one the order of A to E suggests; the picked one may differ. */
  due: Session
  /** No session in the log yet: tonight sets the starting numbers. */
  isCalibration: boolean
  onPick: (session: Session) => void
  onStart: () => void
  /** Already carrying this week's rounds. */
  session: Session
  week: number
}

export const TitlePlate: React.FC<TitlePlateProps> = ({
  done,
  due,
  isCalibration,
  onPick,
  onStart,
  session,
  week
}) => {
  const translate = useTranslate()
  const now = useWallMinute()
  const localize = useLocalize()
  const title = isCalibration
    ? translate('session.title.calibration')
    : translate('session.title.named', { name: localize(session.name) })

  return (
    <Plate className='title-plate'>
      <PlateHead
        rank={translate('common.clock', { time: toFormattableDate(now) })}
        title={capitalize(
          translate('common.longDay', { day: toFormattableDate(now) })
        )}
      />

      <div className='body from-top'>
        <h1 className='headline'>{title}</h1>

        {isCalibration ? (
          <>
            <p className='prose'>
              {translate('session.title.calibrationProse', { id: session.id })}
            </p>
            <p className='prose'>
              {translate('session.title.calibrationLength')}
            </p>
          </>
        ) : (
          <p className='prose'>
            {session.note === undefined
              ? translate('session.title.defaultNote')
              : localize(session.note)}
          </p>
        )}

        <p className='register-label' id='session-register'>
          {translate('session.title.register')}
        </p>
        <RadioGroup
          aria-labelledby='session-register'
          className='ledger register'
          onChange={(id) => {
            const next = BLOCK_1.find((candidate) => candidate.id === id)
            if (next !== undefined) onPick(next)
          }}
          value={session.id}
        >
          {BLOCK_1.map((candidate) => (
            <Radio
              className='choice'
              data-due={candidate.id === due.id || undefined}
              data-state={
                candidate.id === session.id
                  ? 'live'
                  : done.has(candidate.id)
                    ? 'done'
                    : undefined
              }
              key={candidate.id}
              value={candidate.id}
            >
              <span className='address'>{candidate.id}</span>
              <span className='label'>{localize(candidate.name)}</span>
              <span className='state'>
                {candidate.id === session.id && candidate.id !== due.id
                  ? translate('session.title.picked')
                  : done.has(candidate.id)
                    ? translate('session.title.done')
                    : candidate.id === due.id
                      ? translate('session.title.due')
                      : ''}
              </span>
            </Radio>
          ))}
        </RadioGroup>

        <div className='divider' />

        <dl className='facts'>
          <dt>{translate('session.title.lengthTerm')}</dt>
          <dd>
            {translate('session.title.lengthFact', {
              minutes: String(sessionMinutes(session, week))
            })}
          </dd>
          <dt>{translate('session.title.roundsTerm')}</dt>
          <dd>
            {translate('session.title.roundsFact', {
              rounds: String(session.shape.rounds),
              week: String(week)
            })}
          </dd>
          <dt>{translate('session.title.kitTerm')}</dt>
          <dd>
            {session.kit === undefined
              ? translate('session.title.kitFact')
              : localize(session.kit)}
          </dd>
        </dl>

        <div className='divider' />

        <p className='register-label'>{translate('session.title.rules')}</p>
        <dl className='facts rules'>
          <dt>{translate('session.cues.stopTerm')}</dt>
          <dd>
            {translate(
              isCalibration
                ? 'session.cues.stopCalibration'
                : 'session.cues.stop'
            )}
          </dd>
          <dt>{translate('session.cues.tempoTerm')}</dt>
          <dd>{translate('session.title.tempoFact')}</dd>
          <dt>{translate('session.cues.breath')}</dt>
          <dd>{translate('session.title.breathFact')}</dd>
          <dt>{translate('session.cues.supportTerm')}</dt>
          <dd>{translate('session.title.supportFact')}</dd>
        </dl>
      </div>

      <ActionButton
        label={translate(
          done.has(session.id)
            ? 'session.title.restart'
            : 'session.title.start',
          { id: session.id }
        )}
        onPress={onStart}
      />
      <div className='exits'>
        <ActionLink
          href={journalPathFor()}
          label={translate('common.toJournal')}
          tone='ghost'
        />
        <ActionLink
          href={progressPathFor()}
          label={translate('common.toProgress')}
          tone='ghost'
        />
        <ActionLink
          href={tablePathFor('count')}
          label={translate('common.toTable')}
          tone='ghost'
        />
        <ActionLink
          href={settingsPathFor()}
          label={translate('common.toSettings')}
          tone='ghost'
        />
      </div>
    </Plate>
  )
}
