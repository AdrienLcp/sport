import type { Result } from '@adrienlcp/result'
import {
  readRecognizedText,
  type StorageReadError,
  type StorageWriteError,
  writeStoredText
} from '@adrienlcp/safe-storage'

import { isLocale, type Locale } from '@/helpers/localized-text'

/** A device choice, shared by every profile. */
const LOCALE_KEY = 'seance.locale'

/** `null` when this device never chose. */
export const readStoredLocale = (): Result<Locale | null, StorageReadError> =>
  readRecognizedText({ isRecognized: isLocale, key: LOCALE_KEY })

export const writeStoredLocale = (
  locale: Locale
): Result<void, StorageWriteError> =>
  writeStoredText({ key: LOCALE_KEY, text: locale })
