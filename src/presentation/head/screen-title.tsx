import type React from 'react'

import { DocumentTitle } from '@/presentation/head/document-title'
import type { EN_DICTIONARY } from '@/presentation/i18n/dictionary-en'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

type TitledScreen = keyof typeof EN_DICTIONARY.documentTitle

type ScreenTitleProps = {
  /** The screen whose translated name the tab shows. */
  screen: TitledScreen
}

/** The browser tab's name for the screen it is rendered in. */
export const ScreenTitle: React.FC<ScreenTitleProps> = ({ screen }) => {
  const translate = useTranslate()

  return <DocumentTitle>{translate(`documentTitle.${screen}`)}</DocumentTitle>
}
