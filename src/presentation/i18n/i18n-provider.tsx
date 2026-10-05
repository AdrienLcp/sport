import { createSafeContext } from '@adrienlcp/react'
import type React from 'react'
import { useState } from 'react'

import {
  type Locale,
  type LocalizedText,
  textIn
} from '@/helpers/localized-text'
import { preferredLocales } from '@/infrastructure/browser'
import { warnOnFailure } from '@/infrastructure/diagnostics'
import { writeStoredLocale } from '@/infrastructure/storage/locale-storage'
import { I18nProvider as AriaI18nProvider } from '@/presentation/components/i18n-provider'

import { i18n } from './i18n'
import { REGIONAL_LOCALES } from './regional-locales'
import type { Translate } from './translation'

type I18nContextValue = {
  locale: Locale
  /** Switches the whole app with no reload, and remembers it on this device. */
  setLocale: (locale: Locale) => void
  translate: Translate
}

export const [I18nContext, useI18n] =
  createSafeContext<I18nContextValue>('I18nProvider')

export const useTranslate = (): Translate => useI18n().translate

/** Reads a piece of domain content — a movement, a cue — in the current locale. */
export const useLocalize = (): ((text: LocalizedText) => string) => {
  const { locale } = useI18n()
  return (text) => textIn(text, locale)
}

type I18nProviderProps = {
  children: React.ReactNode
  initialLocale: Locale
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  initialLocale
}) => {
  const [locale, setLocaleState] = useState(initialLocale)

  const setLocale = (next: Locale) => {
    const written = writeStoredLocale(next)
    warnOnFailure(written, 'The language could not be saved')
    document.documentElement.lang = next
    setLocaleState(next)
  }

  return (
    <I18nContext
      value={{
        locale,
        setLocale,
        translate: i18n.translator(locale, preferredLocales())
      }}
    >
      <AriaI18nProvider locale={REGIONAL_LOCALES[locale]}>
        {children}
      </AriaI18nProvider>
    </I18nContext>
  )
}
