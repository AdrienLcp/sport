import type React from 'react'
import { useState } from 'react'

import { Figure } from '@/features/figures/figure'
import { isPaced } from '@/features/figures/motion'
import type { Dose, Session } from '@/features/program/program-types'
import { DEFAULT_TEMPO } from '@/features/program/progression'
import { ActionButton } from '@/presentation/components/action'
import { FigureFrame, Plate, PlateHead } from '@/presentation/components/plate'
import { useLocalize, useTranslate } from '@/presentation/i18n/i18n-provider'

import { CueList } from './cue-list'
import { ledgerState } from './run'
import { TimeUp } from './time-up'
import { useClockTones } from './use-clock-tones'
import { useElapsed } from './use-elapsed'

type WarmupPlateProps = {
  index: number
  /** Called when the reader says the drill is done. Never by a clock. */
  onDone: () => void
  session: Session
}

/**
 * One warm-up drill, one plate, the same spread as a set. The cuff and
 * scapular work is drawn rather than named — a beginner who reads « floor
 * Y-T-W » invents a gesture or skips it, and the one skipped is the one the
 * push-ups rely on.
 *
 * The plate turns by hand, like a set. It used to turn itself when the drill's
 * share of three minutes ran out, and a beginner still counting his hip circles
 * lost the plate under him (first real session, September 2026). One number
 * only: the reps to do, or — for a real hold — the seconds, whose clock waits
 * for « Start » and never turns the plate.
 */
export const WarmupPlate: React.FC<WarmupPlateProps> = ({
  index,
  onDone,
  session
}) => {
  const translate = useTranslate()
  const localize = useLocalize()
  const drill = session.warmup[index]
  const next = session.warmup[index + 1]

  const isHold = drill?.dose.kind === 'hold'
  const [isRunning, setIsRunning] = useState(false)
  const elapsed = useElapsed(isHold && isRunning, `warmup-${index}`)

  const doseText = (dose: Dose): string =>
    dose.kind === 'hold'
      ? translate('common.seconds', { count: String(dose.seconds) })
      : dose.per === undefined
        ? String(dose.count)
        : `${dose.count} ${localize(dose.per)}`

  useClockTones(
    isHold && isRunning,
    drill?.dose.kind === 'hold' ? drill.dose.seconds - elapsed : 0
  )

  if (drill === undefined) return null

  const { dose } = drill
  const remaining = dose.kind === 'hold' ? dose.seconds - elapsed : 0
  const shown =
    dose.kind === 'reps'
      ? dose.count
      : !isRunning
        ? dose.seconds
        : Math.max(0, Math.ceil(remaining))
  const isOvertime = isHold && isRunning && remaining <= 0
  const unit =
    dose.kind === 'hold'
      ? translate('common.unit.seconds')
      : dose.per === undefined
        ? translate('common.unit.reps')
        : localize(dose.per)

  return (
    <Plate variant='spread'>
      <div className='first-page'>
        <PlateHead
          chrono={
            dose.kind === 'hold'
              ? {
                  ratio: isRunning ? remaining / dose.seconds : 1,
                  state: 'set'
                }
              : undefined
          }
          rank={translate('common.rank', {
            position: String(index + 1),
            total: String(session.warmup.length)
          })}
          title={translate('session.plateTitle', {
            id: session.id,
            name: translate('session.warmup.name')
          })}
        />

        <div className='aside'>
          <ul className='ledger'>
            {session.warmup.map((entry, position) => {
              const state = ledgerState(position, index)
              return (
                <li data-state={state} key={entry.name.en}>
                  <span className='label'>{localize(entry.name)}</span>
                  <span className='state'>
                    {state === 'done'
                      ? translate('session.ledger.done')
                      : state === 'live'
                        ? translate('session.ledger.live')
                        : doseText(entry.dose)}
                  </span>
                </li>
              )
            })}
          </ul>

          <p className='next-up'>
            {translate('session.next')}
            <b>
              {next === undefined
                ? translate('session.warmup.circuit')
                : localize(next.name)}
            </b>
          </p>

          {drill.guard !== undefined && (
            <p className='guard'>{localize(drill.guard)}</p>
          )}
        </div>

        {isHold && !isRunning ? (
          <ActionButton
            label={translate('session.start')}
            onPress={() => setIsRunning(true)}
          />
        ) : (
          <ActionButton
            label={translate(
              next === undefined
                ? 'session.warmup.toCircuit'
                : 'session.warmup.nextDrill'
            )}
            onPress={onDone}
          />
        )}
      </div>

      <div className='second-page'>
        <FigureFrame isTurning>
          <Figure
            id={drill.figure}
            profile={drill.profile}
            tempo={drill.tempo}
          />
        </FigureFrame>

        <div className='movement turning'>
          <h1 className='caption'>{localize(drill.name)}</h1>
          <p className='legend' data-overtime={isOvertime || undefined}>
            <span className='count'>{shown}</span>
            <span>{unit}</span>
          </p>
          <TimeUp isUp={isOvertime} />
          <CueList
            cues={drill.cues}
            setup={drill.setup}
            support={drill.support}
            tempo={
              isPaced(drill.figure) ? (drill.tempo ?? DEFAULT_TEMPO) : undefined
            }
          />
        </div>
      </div>
    </Plate>
  )
}
