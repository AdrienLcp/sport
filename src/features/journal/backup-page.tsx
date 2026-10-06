import type React from 'react'
import { useState } from 'react'

import {
  readProfileSettingsOrEmpty,
  saveProfileSettings
} from '@/features/profile-settings/use-profile-settings'
import {
  readTrainingLogOrEmpty,
  saveTrainingLog
} from '@/features/program/use-training-log'
import { readTableOrEmpty, saveTable } from '@/features/table/use-table'
import type { IsoDay } from '@/helpers/days'
import { downloadTextFile, readFileText } from '@/infrastructure/browser'
import { today } from '@/infrastructure/clock'
import { warnOnFailure } from '@/infrastructure/diagnostics'
import { settingsPathFor, useGoBack } from '@/infrastructure/router/navigation'
import { ActionButton } from '@/presentation/components/action'
import { FileTrigger } from '@/presentation/components/file-trigger'
import { Plate, PlateHead } from '@/presentation/components/plate'
import { ScreenTitle } from '@/presentation/head/screen-title'
import { useTranslate } from '@/presentation/i18n/i18n-provider'
import { bold, RichText } from '@/presentation/i18n/rich-text'
import type { PlainTranslationKey } from '@/presentation/i18n/translation'
import { useLatestOnly } from '@/presentation/use-latest-only'

import {
  type Backup,
  type BackupRejection,
  backupFileName,
  countBackup,
  gatherBackup,
  parseBackup,
  serializeBackup
} from './backup'
import { shortDay } from './format'

import './backup-page.sass'

const REJECTION_MESSAGES = {
  damaged: 'backup.rejected.damaged',
  not_a_backup: 'backup.rejected.foreign',
  unreadable: 'backup.rejected.foreign'
} as const satisfies Record<BackupRejection | 'unreadable', PlainTranslationKey>

const gatherHere = (today: IsoDay): Backup =>
  gatherBackup({
    log: readTrainingLogOrEmpty(),
    settings: readProfileSettingsOrEmpty(),
    table: readTableOrEmpty(),
    today
  })

type CountsProps = {
  backup: Backup
}

const Counts: React.FC<CountsProps> = ({ backup }) => {
  const translate = useTranslate()
  const total = countBackup(backup)

  return (
    <dl className='facts'>
      <dt>{translate('backup.count.sessions')}</dt>
      <dd>{total.sessions}</dd>
      <dt>{translate('backup.count.measures')}</dt>
      <dd>{total.measures}</dd>
      <dt>{translate('backup.count.days')}</dt>
      <dd>{total.days}</dd>
      <dt>{translate('backup.count.market')}</dt>
      <dd>{total.market}</dd>
    </dl>
  )
}

/**
 * A file, nothing else: export writes one, import replaces everything with
 * it. Replaces, never merges — two devices that both ran a session cannot be
 * reconciled without inventing which one is right.
 */
export const BackupPage: React.FC = () => {
  const translate = useTranslate()
  const goBack = useGoBack(settingsPathFor())
  const [here] = useState(() => gatherHere(today().toString()))
  const [incoming, setIncoming] = useState<Backup | null>(null)
  const [rejection, setRejection] = useState<
    keyof typeof REJECTION_MESSAGES | null
  >(null)
  const reads = useLatestOnly()

  const take = async (file: File | undefined) => {
    if (file === undefined) return
    const read = await reads.run(() => readFileText(file))
    if (read.status === 'failure') return
    const text = read.data
    const backup = text.status === 'success' ? parseBackup(text.data) : text
    setRejection(backup.status === 'failure' ? backup.error : null)
    setIncoming(backup.status === 'success' ? backup.data : null)
  }

  const exportHere = () => {
    const backup = gatherHere(today().toString())
    const saved = downloadTextFile({
      name: backupFileName(backup),
      text: serializeBackup(backup),
      type: 'application/json'
    })
    warnOnFailure(saved, 'The backup file could not be written')
  }

  const replaceWith = (backup: Backup) => {
    saveTrainingLog(backup.log)
    saveTable(backup.table)
    saveProfileSettings(backup.settings)
    goBack()
  }

  if (incoming !== null) {
    const hereCount = countBackup(here)

    return (
      <Plate className='backup-page'>
        <ScreenTitle screen='backup' />
        <PlateHead
          rank={
            incoming.savedAt === ''
              ? translate('backup.unknownDate')
              : shortDay(translate, incoming.savedAt)
          }
          title={translate('backup.incoming.head')}
        />

        <div className='body'>
          <h1 className='headline'>{translate('backup.incoming.title')}</h1>
          <p className='prose'>
            <RichText
              parts={translate.rich('backup.incoming.prose', { b: bold })}
            />
          </p>

          <div className='divider' />
          <Counts backup={incoming} />
          <div className='divider' />

          <p className='here'>
            {translate('backup.incoming.here', {
              measures: hereCount.measures,
              sessions: hereCount.sessions
            })}
          </p>
        </div>

        <ActionButton
          label={translate('backup.incoming.replace')}
          onPress={() => replaceWith(incoming)}
        />
        <ActionButton
          label={translate('common.cancel')}
          onPress={() => setIncoming(null)}
          tone='ghost'
        />
      </Plate>
    )
  }

  return (
    <Plate className='backup-page'>
      <ScreenTitle screen='backup' />
      <PlateHead rank={here.savedAt} title={translate('backup.head')} />

      <div className='body'>
        <h1 className='headline'>{translate('backup.title')}</h1>
        <p className='prose'>{translate('backup.prose')}</p>

        <div className='divider' />
        <Counts backup={here} />
        <div className='divider' />

        <p className='file-name'>
          <RichText
            parts={translate.rich('backup.fileName', {
              b: bold,
              name: backupFileName(here)
            })}
          />
        </p>

        {rejection !== null && (
          <p className='rejected' role='alert'>
            {translate(REJECTION_MESSAGES[rejection])}
          </p>
        )}
      </div>

      <ActionButton label={translate('backup.export')} onPress={exportHere} />
      <div className='exits'>
        <FileTrigger
          acceptedFileTypes={['application/json', '.json']}
          onSelect={(files) => {
            void take(files?.[0] ?? undefined)
          }}
        >
          <ActionButton label={translate('backup.import')} tone='ghost' />
        </FileTrigger>
        <ActionButton
          label={translate('common.back')}
          onPress={goBack}
          tone='ghost'
        />
      </div>
    </Plate>
  )
}
