import type React from 'react'
import { useState } from 'react'

import {
  isProteinTarget,
  proteinTargetOf
} from '@/features/profile-settings/profile-settings'
import { useProfileSettings } from '@/features/profile-settings/use-profile-settings'
import { PROTEIN_TARGET_RANGE } from '@/features/table/table-catalogue'
import { TextField } from '@/presentation/components/text-field'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

/** The one figure the table counts toward. Kept as soon as it reads as one. */
export const ProteinSection: React.FC = () => {
  const translate = useTranslate()
  const [settings, keep] = useProfileSettings()
  const [text, setText] = useState(String(proteinTargetOf(settings)))

  const parsed = Number(text.trim())
  const isValid = text.trim() !== '' && isProteinTarget(parsed)

  return (
    <section className='setting'>
      <h3 className='heading'>{translate('settings.protein.title')}</h3>
      <TextField
        description={translate(
          isValid ? 'settings.protein.hint' : 'settings.protein.invalid',
          {
            max: String(PROTEIN_TARGET_RANGE.max),
            min: String(PROTEIN_TARGET_RANGE.min)
          }
        )}
        inputMode='numeric'
        label={translate('settings.protein.label')}
        onChange={(next) => {
          setText(next)
          const value = Number(next.trim())
          if (next.trim() !== '' && isProteinTarget(value)) {
            keep({ ...settings, proteinTarget: value })
          }
        }}
        unit={translate('table.count.unit')}
        value={text}
      />
    </section>
  )
}
