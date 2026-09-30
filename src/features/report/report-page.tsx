import { copyText, selectContents } from '@adrienlcp/browser'
import type React from 'react'
import { useRef, useState } from 'react'

import { proteinTargetOf } from '@/features/profile-settings/profile-settings'
import { readProfileSettingsOrEmpty } from '@/features/profile-settings/use-profile-settings'
import { readTrainingLogOrEmpty } from '@/features/program/use-training-log'
import { readTableOrEmpty } from '@/features/table/use-table'
import { isoDay } from '@/helpers/days'
import {
  homePathFor,
  journalPathFor,
  useGoBack
} from '@/infrastructure/router/navigation'
import { ActionButton } from '@/presentation/components/action'
import { Plate, PlateHead } from '@/presentation/components/plate'
import { useI18n } from '@/presentation/i18n/i18n-provider'
import { bold, RichText } from '@/presentation/i18n/rich-text'

import { buildReport, isEmptyReport, type ReportScope } from './report'

import './report-page.sass'

type Handover = 'refused' | 'taken' | 'waiting'

type ReportPlateProps = {
  /** Where the way back leads when the report was opened straight from a URL. */
  fallbackPath: string
  scope: ReportScope
}

const ReportPlate: React.FC<ReportPlateProps> = ({ fallbackPath, scope }) => {
  const { locale, translate } = useI18n()
  const goBack = useGoBack(fallbackPath)
  const [today] = useState(() => new Date())
  const [made] = useState(() =>
    buildReport({
      log: readTrainingLogOrEmpty(),
      scope,
      table: readTableOrEmpty(),
      today,
      writing: {
        locale,
        proteinTarget: proteinTargetOf(readProfileSettingsOrEmpty()),
        translate
      }
    })
  )
  const [handover, setHandover] = useState<Handover>('waiting')
  const text = useRef<HTMLPreElement>(null)

  const isNothing = isEmptyReport(made)

  // A refused clipboard is not a dead end: the text is already on the plate,
  // so it gets selected and the reader finishes the copy by hand.
  const hand = async () => {
    const copied = await copyText(made.text)
    if (copied.status === 'success') {
      setHandover('taken')
      return
    }
    setHandover('refused')
    if (text.current !== null) selectContents(text.current)
  }

  return (
    <Plate className='report-page'>
      <PlateHead
        rank={scope === 'evening' ? translate('report.tonight') : isoDay(today)}
        title={translate('report.head')}
      />

      <div className='body from-top'>
        <h1 className='headline'>
          {translate(isNothing ? 'report.emptyTitle' : 'report.title')}
        </h1>

        <p className='prose'>
          {translate(isNothing ? 'report.emptyProse' : 'report.prose')}
        </p>

        <div className='divider' />

        <dl className='facts'>
          <dt>{translate('backup.count.sessions')}</dt>
          <dd>{made.sessions}</dd>
          <dt>{translate('backup.count.measures')}</dt>
          <dd>{made.measures}</dd>
          <dt>{translate('backup.count.days')}</dt>
          <dd>{made.days}</dd>
        </dl>

        {!isNothing && (
          <>
            <div className='divider' />
            <pre className='outgoing' ref={text}>
              {made.text}
            </pre>
          </>
        )}
      </div>

      {handover === 'taken' && (
        <p className='taken'>
          <RichText parts={translate.rich('report.taken', { b: bold })} />
        </p>
      )}

      {handover === 'refused' && (
        <p className='refused'>{translate('report.refused')}</p>
      )}

      <ActionButton
        isDisabled={isNothing}
        label={translate('report.copy')}
        onPress={() => {
          void hand()
        }}
      />
      <div className='exits'>
        <ActionButton
          label={translate('common.back')}
          onPress={goBack}
          tone='ghost'
        />
      </div>
    </Plate>
  )
}

/** Opened from the finished session: tonight's blocks only. */
export const EveningReportPage: React.FC = () => (
  <ReportPlate fallbackPath={homePathFor()} scope='evening' />
)

/** Opened from the journal: everything the app has kept. */
export const FullReportPage: React.FC = () => (
  <ReportPlate fallbackPath={journalPathFor()} scope='all' />
)
