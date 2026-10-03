import type React from 'react'

import { homePathFor, useGoBack } from '@/infrastructure/router/navigation'
import { ActionButton } from '@/presentation/components/action'
import { Plate, PlateHead } from '@/presentation/components/plate'
import { VisuallyHidden } from '@/presentation/components/visually-hidden'
import { ScreenTitle } from '@/presentation/head/screen-title'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

import { DataSection } from './data-section'
import { InstallSection } from './install-section'
import { LanguageSection } from './language-section'
import { ProteinSection } from './protein-section'
import { ReminderSection } from './reminder-section'
import { ThemeSection } from './theme-section'

import './settings-page.sass'

/**
 * The manual's colophon: what this device does — language, printing,
 * reminders, installation — on the left page, and what belongs to the
 * numbers on the right.
 */
export const SettingsPage: React.FC = () => {
  const translate = useTranslate()
  const goBack = useGoBack(homePathFor())

  return (
    <Plate className='settings-page'>
      <ScreenTitle screen='settings' />
      <PlateHead title={translate('settings.head')} />

      <div className='body register'>
        <VisuallyHidden elementType='h1'>
          {translate('settings.head')}
        </VisuallyHidden>
        <div className='columns'>
          <div className='column'>
            <h2 className='page-heading'>{translate('settings.device')}</h2>
            <LanguageSection />
            <ThemeSection />
            <ReminderSection />
            <InstallSection />
          </div>
          <div className='column'>
            <h2 className='page-heading'>{translate('settings.numbers')}</h2>
            <ProteinSection />
            <DataSection />
          </div>
        </div>
      </div>

      <ActionButton
        label={translate('common.backToSession')}
        onPress={goBack}
        tone='ghost'
      />
    </Plate>
  )
}
