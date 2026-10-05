import type React from 'react'
import { useEffect } from 'react'

import { pulse } from '@/infrastructure/browser'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

type TimeUpProps = {
  /** True from the moment the hold reaches its time. */
  isUp: boolean
}

/**
 * What tells a reader face down on the mat that the time is reached: a short
 * vibration where the phone offers one, and the words for a screen reader.
 * The legend itself turns over in ink on its own.
 */
export const TimeUp: React.FC<TimeUpProps> = ({ isUp }) => {
  const translate = useTranslate()

  useEffect(() => {
    if (isUp) pulse()
  }, [isUp])

  return (
    <p className='time-up' role='status'>
      {isUp ? translate('session.set.timeUp') : ''}
    </p>
  )
}
