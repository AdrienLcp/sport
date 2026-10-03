import type React from 'react'

import { FIGURE_IDS } from '@/features/program/program-types'
import { FigureFrame } from '@/presentation/components/plate'
import { ScreenTitle } from '@/presentation/head/screen-title'
import { useLocalize } from '@/presentation/i18n/i18n-provider'

import { Figure } from './figure'
import { allFigureNames } from './figure-names'

import './contact-sheet-page.sass'

/**
 * Every plate at once. Twenty drawings only stay consistent if they can be
 * seen side by side, so the sheet that keeps them honest ships with them.
 */
export const ContactSheetPage: React.FC = () => {
  const localize = useLocalize()
  const names = allFigureNames()

  return (
    <div className='contact-sheet-page'>
      <ScreenTitle screen='contactSheet' />
      {FIGURE_IDS.map((id) => (
        <FigureFrame className='cell' element='figure' key={id}>
          <Figure id={id} />
          <figcaption>
            {localize(names.get(id) ?? { en: id, fr: id })}
          </figcaption>
        </FigureFrame>
      ))}
    </div>
  )
}
