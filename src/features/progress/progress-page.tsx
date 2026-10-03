import type React from 'react'
import { useState } from 'react'

import { decimal, shortDay } from '@/features/journal/format'
import { waistPoints, weightPoints } from '@/features/program/measure-points'
import type { Measure } from '@/features/program/training-log'
import { readTrainingLogOrEmpty } from '@/features/program/use-training-log'
import {
  isReadingSpecimen,
  switchProfile
} from '@/features/specimen/use-specimen'
import { plainDayOf } from '@/helpers/days'
import {
  homePathFor,
  journalPathFor,
  progressPathFor,
  useGoBack
} from '@/infrastructure/router/navigation'
import { useToday } from '@/presentation/clock/use-today'
import { ActionButton, ActionLink } from '@/presentation/components/action'
import {
  type Column,
  ColumnChart
} from '@/presentation/components/charts/column-chart'
import {
  DayGrid,
  type DayMark
} from '@/presentation/components/charts/day-grid'
import { LineChart } from '@/presentation/components/charts/line-chart'
import { zeroBand } from '@/presentation/components/charts/value-band'
import { Plate, PlateHead } from '@/presentation/components/plate'
import { VisuallyHidden } from '@/presentation/components/visually-hidden'
import { ScreenTitle } from '@/presentation/head/screen-title'
import { useTranslate } from '@/presentation/i18n/i18n-provider'
import { bold, RichText } from '@/presentation/i18n/rich-text'
import type { Translate } from '@/presentation/i18n/translation'

import {
  PROGRESS_WEEKS,
  regularityOf,
  STEADY_WEEK_SESSIONS,
  type TrainingDay,
  trainingDays,
  type WeekTally,
  weeklyTallies
} from './progress'

import './progress-page.sass'

const MARK_OF: Record<TrainingDay['state'], DayMark> = {
  future: 'future',
  none: 'empty',
  stopped: 'hollow',
  whole: 'solid'
}

const ANY_MONDAY = Temporal.PlainDate.from('2024-01-01')

/** Monday first, in the reader's language, from any known Monday. */
const weekdayInitials = (
  translate: Translate
): readonly { key: string; label: string }[] =>
  Array.from({ length: 7 }, (_, offset) => {
    const day = ANY_MONDAY.add({ days: offset })
    return {
      key: day.toString(),
      label: translate('progress.regularity.weekday', { day })
    }
  })

type RegularityProps = {
  days: readonly TrainingDay[]
  weeks: readonly WeekTally[]
}

const Regularity: React.FC<RegularityProps> = ({ days, weeks }) => {
  const translate = useTranslate()
  const regularity = regularityOf(weeks)

  return (
    <section className='chart-block'>
      <h2 className='heading'>{translate('progress.regularity.title')}</h2>
      <p className='hint'>
        {translate('progress.regularity.hint', {
          sessions: String(STEADY_WEEK_SESSIONS)
        })}
      </p>

      <dl className='facts runs'>
        <dt>{translate('progress.regularity.current')}</dt>
        <dd>
          {translate('progress.regularity.weeks', {
            weeks: regularity.currentRun
          })}
        </dd>
        <dt>{translate('progress.regularity.longest')}</dt>
        <dd>
          {translate('progress.regularity.weeks', {
            weeks: regularity.longestRun
          })}
        </dd>
        <dt>{translate('progress.regularity.steady')}</dt>
        <dd>
          {translate('progress.regularity.steadyOf', {
            steady: String(regularity.steadyWeeks),
            total: String(weeks.length)
          })}
        </dd>
      </dl>

      <DayGrid
        caption={translate('progress.regularity.gridCaption')}
        days={days.map((day) => ({
          key: day.day,
          mark: MARK_OF[day.state],
          readout: translate(`progress.regularity.day.${day.state}`)
        }))}
        formatKey={(key) =>
          translate('progress.regularity.dayLabel', {
            day: plainDayOf(key)
          })
        }
        summary={translate('progress.regularity.gridSummary', {
          trained: days.filter(
            (day) => day.state === 'whole' || day.state === 'stopped'
          ).length,
          weeks: weeks.length
        })}
        weekdays={weekdayInitials(translate)}
      />

      <ul className='key grid-key'>
        <li>
          <i data-tone='solid' />
          {translate('progress.key.whole')}
        </li>
        <li>
          <i data-tone='hollow' />
          {translate('progress.key.stopped')}
        </li>
      </ul>
    </section>
  )
}

type WeeklyChartsProps = {
  weeks: readonly WeekTally[]
}

const WeeklyCharts: React.FC<WeeklyChartsProps> = ({ weeks }) => {
  const translate = useTranslate()
  const weekLabel = (monday: string) =>
    translate('progress.weekOf', { day: shortDay(translate, monday) })

  const sessionColumns: readonly Column[] = weeks.map((week) => ({
    detail:
      week.stopped > 0
        ? translate('progress.sessions.stoppedDetail', {
            stopped: week.stopped
          })
        : undefined,
    key: week.monday,
    readout: translate('progress.sessions.readout', {
      sessions: week.whole + week.stopped
    }),
    segments: [
      { tone: 'solid', value: week.whole },
      { tone: 'hollow', value: week.stopped }
    ]
  }))
  const sessionBand = zeroBand(
    weeks.map((week) => week.whole + week.stopped),
    5
  )

  const repColumns: readonly Column[] = weeks.map((week) => ({
    key: week.monday,
    readout: translate('progress.volume.readout', { reps: week.reps }),
    segments: [{ tone: 'solid', value: week.reps }]
  }))
  const repBand = zeroBand(
    weeks.map((week) => week.reps),
    100
  )

  const holdColumns: readonly Column[] = weeks.map((week) => ({
    key: week.monday,
    readout: translate('progress.holds.readout', {
      minutes: week.heldSeconds / 60
    }),
    segments: [{ tone: 'solid', value: week.heldSeconds / 60 }]
  }))
  const holdBand = zeroBand(
    weeks.map((week) => week.heldSeconds / 60),
    5
  )

  const total = (pick: (week: WeekTally) => number) =>
    weeks.reduce((sum, week) => sum + pick(week), 0)

  return (
    <>
      <section className='chart-block'>
        <h2 className='heading'>{translate('progress.sessions.title')}</h2>
        <ColumnChart
          band={sessionBand}
          caption={translate('progress.sessions.title')}
          columns={sessionColumns}
          formatEdgeKey={(key) => shortDay(translate, key)}
          formatKey={weekLabel}
          formatTick={(value) => String(value)}
          summary={translate('progress.sessions.summary', {
            sessions: total((week) => week.whole + week.stopped),
            weeks: weeks.length
          })}
          ticks={[0, STEADY_WEEK_SESSIONS, sessionBand.hi]}
        />
        <ul className='key'>
          <li>
            <i data-tone='solid' />
            {translate('progress.key.whole')}
          </li>
          <li>
            <i data-tone='hollow' />
            {translate('progress.key.stopped')}
          </li>
        </ul>
      </section>

      <section className='chart-block'>
        <h2 className='heading'>{translate('progress.volume.title')}</h2>
        <p className='hint'>{translate('progress.volume.hint')}</p>
        <ColumnChart
          band={repBand}
          caption={translate('progress.volume.title')}
          columns={repColumns}
          formatEdgeKey={(key) => shortDay(translate, key)}
          formatKey={weekLabel}
          formatTick={(value) => translate('format.whole', { value })}
          summary={translate('progress.volume.summary', {
            reps: total((week) => week.reps),
            weeks: weeks.length
          })}
          ticks={[0, repBand.hi / 2, repBand.hi]}
        />
      </section>

      <section className='chart-block'>
        <h2 className='heading'>{translate('progress.holds.title')}</h2>
        <ColumnChart
          band={holdBand}
          caption={translate('progress.holds.title')}
          columns={holdColumns}
          formatEdgeKey={(key) => shortDay(translate, key)}
          formatKey={weekLabel}
          formatTick={(value) => translate('format.whole', { value })}
          summary={translate('progress.holds.summary', {
            minutes: total((week) => week.heldSeconds) / 60,
            weeks: weeks.length
          })}
          ticks={[0, holdBand.hi / 2, holdBand.hi]}
        />
      </section>

      <details className='numbers'>
        <summary>{translate('progress.numbers.title')}</summary>
        <table className='tally logbook'>
          <thead>
            <tr>
              <th>{translate('progress.numbers.week')}</th>
              <th>{translate('progress.numbers.sessions')}</th>
              <th>{translate('progress.numbers.stopped')}</th>
              <th>{translate('progress.numbers.reps')}</th>
              <th>{translate('progress.numbers.held')}</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week.monday}>
                <td>{shortDay(translate, week.monday)}</td>
                <td>{week.whole + week.stopped}</td>
                <td>{week.stopped}</td>
                <td>{week.reps}</td>
                <td>
                  {translate('progress.numbers.minutes', {
                    minutes: week.heldSeconds / 60
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </>
  )
}

type MeasurementsProps = {
  measures: readonly Measure[]
}

const Measurements: React.FC<MeasurementsProps> = ({ measures }) => {
  const translate = useTranslate()
  const series = [
    {
      caption: translate('journal.readings.waist'),
      id: 'waist',
      minimumSpan: 4,
      points: waistPoints(measures),
      unit: translate('journal.readings.centimetres')
    },
    {
      caption: translate('journal.readings.weight'),
      id: 'weight',
      minimumSpan: 3,
      points: weightPoints(measures),
      unit: translate('journal.measure.kilograms')
    }
  ]

  return (
    <section className='chart-block'>
      <h2 className='heading'>{translate('progress.body.title')}</h2>
      <p className='hint'>{translate('progress.body.hint')}</p>

      {measures.length === 0 ? (
        <p className='prose'>{translate('progress.body.empty')}</p>
      ) : (
        series.map(({ caption, id, minimumSpan, points, unit }) => {
          const first = points[0]
          const last = points.at(-1)
          if (first === undefined || last === undefined) return null
          const withUnit = (value: number) =>
            translate('progress.body.value', {
              unit,
              value: decimal(translate, value)
            })
          return (
            <div className='measure' key={id}>
              <h3 className='measure-name'>{caption}</h3>
              <LineChart
                caption={caption}
                formatKey={(key) => shortDay(translate, key)}
                formatTick={(value) => decimal(translate, value)}
                formatValue={withUnit}
                minimumSpan={minimumSpan}
                points={points.map((point) => ({
                  key: point.day,
                  time: point.time,
                  value: point.value
                }))}
                summary={translate('progress.body.summary', {
                  first: withUnit(first.value),
                  firstDay: shortDay(translate, first.day),
                  last: withUnit(last.value),
                  lastDay: shortDay(translate, last.day)
                })}
              />
            </div>
          )
        })
      )}
    </section>
  )
}

/**
 * The curves the journal's register does not draw: how regular the weeks
 * were, how much work they held, and where the body went. Read from the
 * journal alone — nothing here is entered.
 */
export const ProgressPage: React.FC = () => {
  const translate = useTranslate()
  const goBack = useGoBack(homePathFor())
  const [log] = useState(readTrainingLogOrEmpty)
  const today = useToday()

  const weeks = weeklyTallies({ log, today })
  const days = trainingDays({ log, today })
  const measures = log.measures ?? []
  const isEmpty = log.entries.length === 0 && measures.length === 0

  return (
    <Plate className='progress-page'>
      <ScreenTitle screen='progress' />
      <PlateHead
        rank={translate('progress.rank', { weeks: PROGRESS_WEEKS })}
        title={translate('progress.head')}
      />

      {isEmpty ? (
        <div className='body'>
          <h1 className='headline'>{translate('progress.empty.title')}</h1>
          <p className='prose'>
            <RichText
              parts={translate.rich('progress.empty.prose', { b: bold })}
            />
          </p>
        </div>
      ) : (
        <div className='body register'>
          <VisuallyHidden elementType='h1'>
            {translate('progress.head')}
          </VisuallyHidden>
          <div className='columns'>
            <div className='column'>
              <Regularity days={days} weeks={weeks} />
              <Measurements measures={measures} />
            </div>
            <div className='column'>
              <WeeklyCharts weeks={weeks} />
            </div>
          </div>
        </div>
      )}

      {isEmpty && !isReadingSpecimen() ? (
        <ActionButton
          label={translate('specimen.open')}
          onPress={() =>
            switchProfile({ path: progressPathFor(), profile: 'specimen' })
          }
        />
      ) : (
        <ActionLink
          href={journalPathFor()}
          label={translate('common.toJournal')}
        />
      )}
      <div className='exits'>
        <ActionButton
          label={translate('common.backToSession')}
          onPress={goBack}
          tone='ghost'
        />
      </div>
    </Plate>
  )
}
