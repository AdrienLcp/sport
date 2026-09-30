import type { DotPath, PlainKey, Translator } from '@adrienlcp/i18n'

import type { EN_DICTIONARY } from './dictionary-en'

export type TranslationKey = DotPath<typeof EN_DICTIONARY>

/** A key whose message needs no value: what a lookup table may hold. */
export type PlainTranslationKey = PlainKey<typeof EN_DICTIONARY>

export type Translate = Translator<typeof EN_DICTIONARY>
