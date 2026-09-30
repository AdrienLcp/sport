import type React from 'react'
import { useState } from 'react'

import { EMPTY_PROFILE_SETTINGS } from '@/features/profile-settings/profile-settings'
import {
  readProfileSettingsOrEmpty,
  saveProfileSettings
} from '@/features/profile-settings/use-profile-settings'
import {
  readTrainingLogOrEmpty,
  saveTrainingLog
} from '@/features/program/use-training-log'
import { readTableOrEmpty, saveTable } from '@/features/table/use-table'
import { downloadTextFile, readFileText } from '@/infrastructure/browser'
import { settingsPathFor, useGoBack } from '@/infrastructure/router/navigation'
import { ActionButton } from '@/presentation/components/action'
import { FileTrigger } from '@/presentation/components/file-trigger'
import { Plate, PlateHead } from '@/presentation/components/plate'
import { useTranslate } from '@/presentation/i18n/i18n-provider'
import { bold, RichText } from '@/presentation/i18n/rich-text'

import {
  type Backup,
  backupFileName,
  countBackup,
  gatherBackup,
  parseBackup,
  serializeBackup
} from './backup'
import { shortDay } from './format'

import './backup-page.sass'

const gatherHere = (today: Date): Backup =>
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
  const [today] = useState(() => new Date())
  const [here] = useState(() => gatherHere(today))
  const [incoming, setIncoming] = useState<Backup | null>(null)
  const [isRejected, setIsRejected] = useState(false)

  const take = async (file: File | undefined) => {
    if (file === undefined) return
    const text = await readFileText(file)
    const backup = text.status === 'success' ? parseBackup(text.data) : text
    setIsRejected(backup.status === 'failure')
    setIncoming(backup.status === 'success' ? backup.data : null)
  }

  const exportHere = () => {
    const backup = gatherHere(today)
    const saved = downloadTextFile({
      name: backupFileName(backup),
      text: serializeBackup(backup),
      type: 'application/json'
    })
    if (saved.status === 'failure') {
      console.warn(`The backup file could not be written (${saved.error}).`)
    }
  }

  const replaceWith = (backup: Backup) => {
    saveTrainingLog(backup.log)
    saveTable(backup.table)
    saveProfileSettings(backup.settings ?? EMPTY_PROFILE_SETTINGS)
    goBack()
  }

  if (incoming !== null) {
    const hereCount = countBackup(here)

    return (
      <Plate className='backup-page'>
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

        {isRejected && (
          <p className='rejected'>{translate('backup.rejected')}</p>
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
