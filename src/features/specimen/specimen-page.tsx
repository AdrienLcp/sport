import type React from 'react'
import { useEffect } from 'react'

import { progressPathFor } from '@/infrastructure/router/navigation'
import { ScreenTitle } from '@/presentation/head/screen-title'

import { switchProfile } from './use-specimen'

/**
 * `/specimen`: the address a visitor is sent to. It prints a fresh specimen,
 * switches to it and lands on the curves; the plate on screen meanwhile is the
 * bare ground, for the instant the load takes.
 */
export const SpecimenPage: React.FC = () => {
  useEffect(() => {
    switchProfile({ path: progressPathFor(), profile: 'specimen' })
  }, [])
  return <ScreenTitle screen='specimen' />
}
