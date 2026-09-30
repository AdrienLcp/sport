import type React from 'react'

import { isLocale, LOCALES } from '@/helpers/localized-text'
import { Radio, RadioGroup } from '@/presentation/components/radio-group'
import { useI18n, useTranslate } from '@/presentation/i18n/i18n-provider'

/** Each language names itself, in itself: a reader lost in the wrong one still finds theirs. */
export const LanguageSection: React.FC = () => {
  const translate = useTranslate()
  const { locale, setLocale } = useI18n()

  return (
    <section className='setting'>
      <h3 className='heading' id='language-heading'>
        {translate('settings.language.title')}
      </h3>
      <RadioGroup
        aria-labelledby='language-heading'
        className='ledger register'
        onChange={(value) => {
          if (isLocale(value)) setLocale(value)
        }}
        value={locale}
      >
        {LOCALES.map((candidate) => (
          <Radio
            className='choice'
            data-state={candidate === locale ? 'live' : undefined}
            key={candidate}
            lang={candidate}
            value={candidate}
          >
            <span className='label'>
              {translate(`settings.language.name.${candidate}`)}
            </span>
            <span className='state'>
              {candidate === locale ? translate('settings.chosen') : ''}
            </span>
          </Radio>
        ))}
      </RadioGroup>
    </section>
  )
}
