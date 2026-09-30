import { createI18n } from '@adrienlcp/i18n'

import type { Locale } from '@/helpers/localized-text'

import { EN_DICTIONARY } from './dictionary-en'
import { FR_DICTIONARY } from './dictionary-fr'

/** English is the reference every key is typed from; French is held to it. */
export const i18n = createI18n({
  defaultLocale: 'en',
  dictionaries: {
    en: EN_DICTIONARY,
    fr: FR_DICTIONARY
  } satisfies Record<Locale, unknown>
})
