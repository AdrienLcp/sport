import type { Locale } from '@/helpers/localized-text'
import { preferredLocales } from '@/infrastructure/browser'
import { readStoredLocale } from '@/infrastructure/storage/locale-storage'

import { i18n } from './i18n'

const storedLocaleOrNone = (): Locale | null => {
  const read = readStoredLocale()
  if (read.status === 'success') return read.data
  console.warn(`The stored language could not be read (${read.error}).`)
  return null
}

/**
 * This device's last choice first, then what the browser says it reads. Called
 * before React renders, so `<html lang>` is right from the first paint and no
 * browser offers to translate French it believes is English.
 */
export const applyInitialLocale = (): Locale => {
  const locale = storedLocaleOrNone() ?? i18n.negotiate(preferredLocales())
  document.documentElement.lang = locale
  return locale
}
