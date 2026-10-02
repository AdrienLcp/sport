import type React from 'react'

import { Button } from '@/presentation/components/button'
import { PlateHead } from '@/presentation/components/plate'
import { useLocalize, useTranslate } from '@/presentation/i18n/i18n-provider'
import { bold, RichText } from '@/presentation/i18n/rich-text'

import { DAY_SHAPE, gramsOfShare, SOURCES } from './table-catalogue'
import { type DayCount, proteinOf, runUpTo, type Table } from './table-tally'

import './count-plate.sass'

type RunProps = {
  day: string
  table: Table
}

/** Yesterday, and the mean of the days before it: the count's own history. */
const Run: React.FC<RunProps> = ({ day, table }) => {
  const translate = useTranslate()
  const previous = runUpTo(table, day)
  const yesterday = previous[0]
  if (yesterday === undefined) {
    return <p className='prior'>{translate('table.count.firstCount')}</p>
  }

  const week = previous.slice(0, 7)
  const mean =
    week.reduce((total, entry) => total + entry.protein, 0) / week.length

  return (
    <p className='prior'>
      <RichText
        parts={
          week.length > 1
            ? translate.rich('table.count.priorWithMean', {
                b: bold,
                days: String(week.length),
                mean: translate('table.grams', { value: mean }),
                yesterday: translate('table.grams', {
                  value: yesterday.protein
                })
              })
            : translate.rich('table.count.prior', {
                b: bold,
                yesterday: translate('table.grams', {
                  value: yesterday.protein
                })
              })
        }
      />
    </p>
  )
}

type SourcesProps = {
  count: DayCount
  onCount: (id: string, delta: number) => void
}

const Sources: React.FC<SourcesProps> = ({ count, onCount }) => {
  const translate = useTranslate()
  const localize = useLocalize()

  return (
    <ul className='sources'>
      {SOURCES.map((source) => {
        const taps = count[source.id] ?? 0

        return (
          <li data-counted={taps > 0} key={source.id}>
            <Button
              aria-label={translate('table.count.add', {
                grams: translate('table.grams', { value: source.protein }),
                name: localize(source.name),
                portion: localize(source.portion)
              })}
              className='add'
              onPress={() => onCount(source.id, 1)}
            >
              <span className='source-name'>{localize(source.name)}</span>
              <span className='portion'>{localize(source.portion)}</span>
              {taps > 1 && (
                <span className='taps'>
                  {translate('table.count.taps', { taps: String(taps) })}
                </span>
              )}
              <span className='yield'>
                {translate('table.count.yield', {
                  grams: translate('table.grams', {
                    value: source.protein * Math.max(1, taps)
                  })
                })}
              </span>
            </Button>

            <Button
              aria-label={translate('table.count.remove', {
                name: localize(source.name)
              })}
              className='less'
              excludeFromTabOrder={taps === 0}
              onPress={() => onCount(source.id, -1)}
            >
              {translate('common.minus')}
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

type CountPlateProps = {
  day: string
  /** The day's protein target, in grams: the profile's own. */
  target: number
  onCount: (id: string, delta: number) => void
  table: Table
  today: Temporal.PlainDate
}

/** T-01: the day's protein, the gauge under the band, and the sources to tap. */
export const CountPlate: React.FC<CountPlateProps> = ({
  day,
  onCount,
  table,
  target,
  today
}) => {
  const translate = useTranslate()
  const localize = useLocalize()
  const count = table.days[day] ?? {}
  const total = proteinOf(count)
  const short = target - total

  return (
    <>
      <PlateHead
        gauge={total / target}
        rank={translate('table.date', { day: today })}
        title={translate('table.count.head')}
      />

      <div className='body register turning count-plate'>
        <div className='columns'>
          <section className='column settled'>
            <p className='total'>
              <b>{translate('table.grams', { value: total })}</b>
              <span className='unit'>{translate('table.count.unit')}</span>
              <span className='of-target'>
                {translate('table.count.of', {
                  target: String(target)
                })}
              </span>
            </p>

            <p className='shortfall' data-met={short <= 0}>
              {short > 0 ? (
                <RichText
                  parts={translate.rich('table.count.short', {
                    b: bold,
                    grams: translate('table.grams', { value: short })
                  })}
                />
              ) : (
                translate('table.count.met')
              )}
            </p>

            {total === 0 && (
              <p className='prose'>
                {translate('table.count.why', { target: String(target) })}
              </p>
            )}

            <div className='divider' />

            <dl className='facts'>
              {DAY_SHAPE.flatMap((share) => [
                <dt key={`${share.moment.en}-term`}>
                  {localize(share.moment)}
                </dt>,
                <dd key={`${share.moment.en}-grams`}>
                  {translate('table.count.shareGrams', {
                    grams: String(gramsOfShare(target, share.share))
                  })}
                </dd>
              ])}
            </dl>

            <div className='divider' />

            <Run day={day} table={table} />
          </section>

          <section className='column'>
            <h2 className='heading'>{translate('table.count.sourcesTitle')}</h2>
            <p className='hint'>{translate('table.count.sourcesHint')}</p>
            <Sources count={count} onCount={onCount} />
          </section>
        </div>
      </div>
    </>
  )
}
