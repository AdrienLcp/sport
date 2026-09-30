/** The locales the app speaks. Content and interface copy share the list. */
export const LOCALES = ['en', 'fr'] as const

export type Locale = (typeof LOCALES)[number]

/**
 * A piece of domain content — a movement's name, a cue, a shopping item — in
 * every locale at once. Content is data selected by locale, never a dictionary
 * key: the programme reads as one table, with its two languages side by side.
 */
export type LocalizedText = Readonly<Record<Locale, string>>

export const textIn = (text: LocalizedText, locale: Locale): string =>
  text[locale]

export const isLocale = (value: unknown): value is Locale =>
  LOCALES.some((locale) => locale === value)
