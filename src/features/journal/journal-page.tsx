import type React from 'react'
import { useState } from 'react'

import {
  drift,
  waistPoints,
  weightPoints
} from '@/features/program/measure-points'
import { weekOf } from '@/features/program/schedule'
import type { Measure } from '@/features/program/training-log'
import { readTrainingLogOrEmpty } from '@/features/program/use-training-log'
import {
  homePathFor,
  journalMeasurePathFor,
  journalReportPathFor,
  progressPathFor,
  useGoBack
} from '@/infrastructure/router/navigation'
import { ActionButton, ActionLink } from '@/presentation/components/action'
import { LineChart } from '@/presentation/components/charts/line-chart'
import { Plate, PlateHead } from '@/presentation/components/plate'
import { VisuallyHidden } from '@/presentation/components/visually-hidden'
import { ScreenTitle } from '@/presentation/head/screen-title'
import { useLocalize, useTranslate } from '@/presentation/i18n/i18n-provider'
import { bold, RichText } from '@/presentation/i18n/rich-text'

import { decimal, shortDay, signed } from './format'
import { tally, weeksPresent } from './history'

import './journal-page.sass'

type WaistChartProps = {
  points: ReturnType<typeof waistPoints>
}

const WaistChart: React.FC<WaistChartProps> = ({ points }) => {
  const translate = useTranslate()
  const first = points[0]
  const last = points.at(-1)
  if (first === undefined || last === undefined) return null

  const inCentimetres = (value: number) =>
    translate('journal.readings.inCentimetres', {
      value: decimal(translate, value)
    })

  return (
    <LineChart
      caption={translate('journal.readings.waist')}
      formatKey={(key) => shortDay(translate, key)}
      formatTick={(value) => decimal(translate, value)}
      formatValue={inCentimetres}
      minimumSpan={4}
      points={points.map((point) => ({
        key: point.day,
        time: point.time,
        value: point.value
      }))}
      summary={translate('progress.body.summary', {
        first: inCentimetres(first.value),
        firstDay: shortDay(translate, first.day),
        last: inCentimetres(last.value),
        lastDay: shortDay(translate, last.day)
      })}
    />
  )
}

type ReadingsProps = {
  measures: readonly Measure[]
}

const Readings: React.FC<ReadingsProps> = ({ measures }) => {
  const translate = useTranslate()
  const waist = waistPoints(measures)
  const weight = weightPoints(measures)
  const waistDrift = drift(waist)
  const weightDrift = drift(weight)
  const last = measures.at(-1)

  return (
    <>
      <WaistChart points={waist} />

      {waistDrift !== undefined && (
        <p className='drift'>
          <RichText
            parts={
              weightDrift === undefined
                ? translate.rich('journal.readings.driftWaist', {
                    b: bold,
                    waist: signed(translate, waistDrift)
                  })
                : translate.rich('journal.readings.driftBoth', {
                    b: bold,
                    waist: signed(translate, waistDrift),
                    weight: signed(translate, weightDrift)
                  })
            }
          />
        </p>
      )}

      <table className='tally logbook readings'>
        <thead>
          <tr>
            <th>{translate('journal.readings.reading')}</th>
            <th>{translate('journal.readings.waistColumn')}</th>
            <th>{translate('journal.readings.weightColumn')}</th>
          </tr>
        </thead>
        <tbody>
          {measures.map((measure) => (
            <tr data-last={measure.day === last?.day} key={measure.day}>
              <td>{shortDay(translate, measure.day)}</td>
              <td>
                {measure.waist === undefined
                  ? translate('common.none')
                  : translate('journal.readings.inCentimetres', {
                      value: decimal(translate, measure.waist)
                    })}
              </td>
              <td>
                {measure.weight === undefined
                  ? translate('common.none')
                  : translate('journal.readings.inKilograms', {
                      value: decimal(translate, measure.weight)
                    })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

/** The register: the waist on the left page, the sessions on the right. */
export const JournalPage: React.FC = () => {
  const translate = useTranslate()
  const localize = useLocalize()
  const goBack = useGoBack(homePathFor())
  const [log] = useState(readTrainingLogOrEmpty)

  const measures = log.measures ?? []
  const blocks = tally(log)
  const weeks = weeksPresent(log)

  return (
    <Plate className='journal-page'>
      <ScreenTitle screen='journal' />
      <PlateHead
        rank={translate('common.week', { week: String(weekOf(log)) })}
        title={translate('journal.title')}
      />

      <div className='body register'>
        <div className='columns'>
          <section className='column'>
            <h1 className='heading'>{translate('journal.readings.waist')}</h1>
            {measures.length === 0 ? (
              <>
                <p className='prose'>{translate('journal.noReading.why')}</p>
                <p className='prose'>{translate('journal.noReading.how')}</p>
              </>
            ) : (
              <Readings measures={measures} />
            )}
          </section>

          <section className='column'>
            <h2 className='heading'>{translate('journal.numbers.title')}</h2>

            {blocks.length === 0 ? (
              <p className='prose'>{translate('journal.numbers.empty')}</p>
            ) : (
              <>
                <p className='session-count'>
                  <RichText
                    parts={translate.rich('journal.numbers.count', {
                      b: bold,
                      sessions: String(log.entries.length),
                      weeks: weeks.length
                    })}
                  />
                </p>

                {blocks.map(({ cutShort, rows, runs, session }) => (
                  <div className='session-block' key={session.id}>
                    <h3 className='session-head'>
                      <span>
                        {translate('journal.numbers.session', {
                          id: session.id,
                          name: localize(session.name)
                        })}
                      </span>
                      <span className='runs'>
                        {cutShort > 0
                          ? translate('journal.numbers.runsStopped', {
                              runs: String(runs),
                              stopped: cutShort
                            })
                          : translate('journal.numbers.runs', {
                              runs: String(runs)
                            })}
                      </span>
                    </h3>

                    <table className='tally logbook'>
                      <thead>
                        <tr>
                          <th>
                            <VisuallyHidden elementType='span'>
                              {translate('journal.numbers.movement')}
                            </VisuallyHidden>
                          </th>
                          {weeks.map((week) => (
                            <th key={week}>
                              {translate('journal.numbers.weekColumn', {
                                week: String(week)
                              })}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr key={row.address}>
                            <td>
                              {row.timed
                                ? translate('journal.numbers.timedName', {
                                    name: localize(row.name)
                                  })
                                : localize(row.name)}
                            </td>
                            {weeks.map((week, column) => {
                              const value = row.byWeek[column]
                              return (
                                <td key={week}>
                                  {value ?? translate('common.none')}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </>
            )}
          </section>
        </div>
      </div>

      <ActionLink
        href={journalMeasurePathFor()}
        label={translate('journal.noteReading')}
      />
      <div className='exits'>
        <ActionLink
          href={progressPathFor()}
          label={translate('common.toProgress')}
          tone='ghost'
        />
        <ActionLink
          href={journalReportPathFor()}
          label={translate('common.toReport')}
          tone='ghost'
        />
        <ActionButton
          label={translate('common.backToSession')}
          onPress={goBack}
          tone='ghost'
        />
      </div>
    </Plate>
  )
}
