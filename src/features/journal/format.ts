import { dateOfDay } from '@/helpers/days'
import type { Translate } from '@/presentation/i18n/translation'

/** One decimal, always: 94,0 beside 93,5 keeps the column aligned. */
export const decimal = (translate: Translate, value: number): string =>
  translate('format.decimal', { value })

/** The sign is typography, not copy: a true minus, and ± for no change. */
export const signed = (translate: Translate, value: number): string => {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '±'
  return `${sign}${decimal(translate, Math.abs(value))}`
}

export const shortDay = (translate: Translate, day: string): string =>
  translate('format.shortDay', { day: dateOfDay(day) })
