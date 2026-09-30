import {
  isThemePreference,
  THEME_PREFERENCES
} from '@adrienlcp/theme-preference'
import { useThemePreference } from '@adrienlcp/theme-preference/react'
import type React from 'react'

import { Radio, RadioGroup } from '@/presentation/components/radio-group'
import { useTranslate } from '@/presentation/i18n/i18n-provider'
import { themeStore } from '@/presentation/theme/theme-store'

/** The night printing or the day printing, or whichever the device is in. */
export const ThemeSection: React.FC = () => {
  const translate = useTranslate()
  const { preference, setPreference } = useThemePreference(themeStore)

  return (
    <section className='setting'>
      <h3 className='heading' id='theme-heading'>
        {translate('settings.theme.title')}
      </h3>
      <RadioGroup
        aria-labelledby='theme-heading'
        className='ledger register'
        onChange={(value) => {
          if (isThemePreference(value)) setPreference(value)
        }}
        value={preference}
      >
        {THEME_PREFERENCES.map((candidate) => (
          <Radio
            className='choice'
            data-state={candidate === preference ? 'live' : undefined}
            key={candidate}
            value={candidate}
          >
            <span className='label'>
              {translate(`settings.theme.${candidate}`)}
            </span>
            <span className='state'>
              {candidate === preference ? translate('settings.chosen') : ''}
            </span>
          </Radio>
        ))}
      </RadioGroup>
    </section>
  )
}
