import type React from 'react'
import { useState } from 'react'

import { putMeasure } from '@/features/program/training-log'
import { useTrainingLog } from '@/features/program/use-training-log'
import { plainDayOf } from '@/helpers/days'
import { capitalize } from '@/helpers/text'
import { journalPathFor, useGoBack } from '@/infrastructure/router/navigation'
import { useToday } from '@/presentation/clock/use-today'
import { ActionButton } from '@/presentation/components/action'
import { Plate, PlateHead } from '@/presentation/components/plate'
import { TextField } from '@/presentation/components/text-field'
import { toFormattableDate } from '@/presentation/i18n/formattable-date'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

import './measure-page.sass'

/** A comma or a point, and nothing that is not a positive number. */
const parseMeasure = (text: string): number | undefined => {
  const value = Number(text.replace(',', '.').trim())
  return text.trim() === '' || Number.isNaN(value) || value <= 0
    ? undefined
    : value
}

/** The Friday morning reading. Noting twice the same day corrects the first. */
export const MeasurePage: React.FC = () => {
  const translate = useTranslate()
  const goBack = useGoBack(journalPathFor())
  const [log, keepLog] = useTrainingLog()

  const day = useToday()
  const existing = log.measures?.find((measure) => measure.day === day)
  const [waist, setWaist] = useState(
    existing?.waist === undefined ? '' : String(existing.waist)
  )
  const [weight, setWeight] = useState(
    existing?.weight === undefined ? '' : String(existing.weight)
  )

  const parsed = { waist: parseMeasure(waist), weight: parseMeasure(weight) }
  const isEmpty = parsed.waist === undefined && parsed.weight === undefined

  const save = () => {
    keepLog(
      putMeasure(log, { day, waist: parsed.waist, weight: parsed.weight })
    )
    goBack()
  }

  return (
    <Plate className='measure-page'>
      <PlateHead
        rank={
          existing === undefined
            ? undefined
            : translate('journal.measure.correction')
        }
        title={translate('journal.measure.head')}
      />

      <div className='body from-top'>
        <h1 className='headline'>{translate('journal.measure.title')}</h1>
        <p className='prose'>
          {translate('journal.measure.prose', {
            day: capitalize(
              translate('common.longDay', {
                day: toFormattableDate(plainDayOf(day))
              })
            )
          })}
        </p>

        <div className='divider' />

        <div className='fields'>
          <TextField
            description={translate('journal.measure.waistHint')}
            inputMode='decimal'
            label={translate('journal.readings.waist')}
            onChange={setWaist}
            placeholder={translate('common.none')}
            unit={translate('journal.readings.centimetres')}
            value={waist}
          />
          <TextField
            description={translate('journal.measure.weightHint')}
            inputMode='decimal'
            label={translate('journal.measure.weight')}
            onChange={setWeight}
            placeholder={translate('common.none')}
            unit={translate('journal.measure.kilograms')}
            value={weight}
          />
        </div>
      </div>

      <ActionButton
        isDisabled={isEmpty}
        label={translate(
          isEmpty ? 'journal.measure.nothing' : 'journal.measure.save'
        )}
        onPress={save}
      />
      <ActionButton
        label={translate('common.cancel')}
        onPress={goBack}
        tone='ghost'
      />
    </Plate>
  )
}
