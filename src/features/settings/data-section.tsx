import type React from 'react'

import {
  isReadingSpecimen,
  switchProfile
} from '@/features/specimen/use-specimen'
import {
  journalBackupPathFor,
  progressPathFor,
  settingsPathFor
} from '@/infrastructure/router/navigation'
import { ActionButton, ActionLink } from '@/presentation/components/action'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

import { LogWipe } from './log-wipe'

/** Where the numbers live, how to carry them, and the specimen kept beside them. */
export const DataSection: React.FC = () => {
  const translate = useTranslate()
  const isSpecimen = isReadingSpecimen()

  return (
    <>
      <section className='setting'>
        <h3 className='heading'>{translate('settings.data.title')}</h3>
        <p className='prose'>{translate('settings.data.prose')}</p>
        <ActionLink
          href={journalBackupPathFor()}
          label={translate('settings.data.backup')}
          tone='ghost'
        />
      </section>

      <LogWipe />

      <section className='setting'>
        <h3 className='heading'>{translate('specimen.title')}</h3>
        <p className='prose'>
          {translate(isSpecimen ? 'specimen.readingProse' : 'specimen.prose')}
        </p>
        {isSpecimen ? (
          <div className='exits'>
            <ActionButton
              label={translate('specimen.reset')}
              onPress={() =>
                switchProfile({ path: settingsPathFor(), profile: 'specimen' })
              }
              tone='ghost'
            />
            <ActionButton
              label={translate('specimen.leave')}
              onPress={() =>
                switchProfile({ path: settingsPathFor(), profile: 'own' })
              }
              tone='ghost'
            />
          </div>
        ) : (
          <ActionButton
            label={translate('specimen.open')}
            onPress={() =>
              switchProfile({ path: progressPathFor(), profile: 'specimen' })
            }
            tone='ghost'
          />
        )}
      </section>
    </>
  )
}
