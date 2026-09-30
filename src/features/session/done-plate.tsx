import { MOVEMENTS } from '@programme/movements'
import type React from 'react'

import type { Session } from '@/features/program/program-types'
import { isTimed } from '@/features/program/progression'
import {
  type Log,
  movementOf,
  numberToBeat,
  type SetResult
} from '@/features/program/training-log'
import {
  journalPathFor,
  sessionReportPathFor
} from '@/infrastructure/router/navigation'
import { ActionButton, ActionLink } from '@/presentation/components/action'
import { Plate, PlateHead } from '@/presentation/components/plate'
import { useLocalize, useTranslate } from '@/presentation/i18n/i18n-provider'

type DonePlateProps = {
  day: string
  /** Ended by « End the session » rather than run to the last stretch. */
  isStopped: boolean
  /** The log as it stood before tonight was written into it. */
  log: Log
  onClose: () => void
  results: readonly SetResult[]
  session: Session
  week: number
}

export const DonePlate: React.FC<DonePlateProps> = ({
  day,
  isStopped,
  log,
  onClose,
  results,
  session,
  week
}) => {
  const translate = useTranslate()
  const localize = useLocalize()

  /** A station the session never reached did not score zero: it has no number. */
  const tally = (best: number | undefined, isTimedEffort: boolean): string => {
    if (best === undefined) return translate('common.none')
    return isTimedEffort
      ? translate('common.seconds', { count: String(best) })
      : String(best)
  }

  const rows = session.circuit.map((station) => {
    const mine = results.filter((result) => result.address === station.address)
    const best =
      mine.length > 0
        ? Math.max(...mine.map((result) => result.value))
        : undefined
    const before = numberToBeat({
      address: station.address,
      log,
      round: 1,
      sessionId: session.id,
      today: day
    })
    return { before, best, station }
  })

  return (
    <Plate>
      <PlateHead
        rank={translate('common.week', { week: String(week) })}
        title={translate('session.plateTitle', {
          id: session.id,
          name: translate(
            isStopped ? 'session.done.stoppedName' : 'session.done.doneName'
          )
        })}
      />

      <div className='body'>
        <h1 className='headline'>
          {translate(
            isStopped ? 'session.done.stoppedTitle' : 'session.done.doneTitle'
          )}
        </h1>
        <p className='prose'>
          {translate(
            isStopped ? 'session.done.stoppedProse' : 'session.done.doneProse'
          )}
        </p>
        <table className='tally'>
          <thead>
            <tr>
              <th>{translate('session.done.movement')}</th>
              <th>{translate('session.done.before')}</th>
              <th>{translate('session.done.tonight')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ before, best, station }) => (
              <tr key={station.address}>
                <td>{localize(MOVEMENTS[movementOf(station, log)].name)}</td>
                <td>{before ?? translate('common.none')}</td>
                <td>{tally(best, isTimed(station.effort))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ActionLink
        href={sessionReportPathFor()}
        label={translate('common.toReport')}
      />
      <div className='exits'>
        <ActionLink
          href={journalPathFor()}
          label={translate('common.toJournal')}
          tone='ghost'
        />
        <ActionButton
          label={translate('session.done.close')}
          onPress={onClose}
          tone='ghost'
        />
      </div>
    </Plate>
  )
}
