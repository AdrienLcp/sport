import type React from 'react'

import { Button } from '@/presentation/components/button'
import { PlateHead } from '@/presentation/components/plate'
import { ToggleButton } from '@/presentation/components/toggle-button'
import { useLocalize, useTranslate } from '@/presentation/i18n/i18n-provider'
import { bold, RichText } from '@/presentation/i18n/rich-text'

import { MARKET, MARKET_COUNT } from './table-catalogue'

import './market-plate.sass'

type MarketPlateProps = {
  onClear: () => void
  onTick: (id: string) => void
  /** Ids of the items already in the basket this week. */
  ticked: readonly string[]
  today: Date
}

/** T-03: the same list every week, ticked as it lands in the basket. */
export const MarketPlate: React.FC<MarketPlateProps> = ({
  onClear,
  onTick,
  ticked,
  today
}) => {
  const translate = useTranslate()
  const localize = useLocalize()
  const done = ticked.length

  return (
    <>
      <PlateHead
        rank={translate('table.date', { day: today })}
        title={translate('table.market.head')}
      />

      <div className='body register turning market-plate'>
        <div className='list-head'>
          <p className='hint tick-count'>
            <RichText
              parts={translate.rich(
                done === MARKET_COUNT
                  ? 'table.market.countDone'
                  : 'table.market.count',
                { b: bold, done: String(done), total: String(MARKET_COUNT) }
              )}
            />
          </p>
          <Button className='clear' isDisabled={done === 0} onPress={onClear}>
            {translate('table.market.clear')}
          </Button>
        </div>

        <p className='prose'>{translate('table.market.prose')}</p>

        <div className='aisles'>
          {MARKET.map((aisle) => (
            <section className='aisle' key={aisle.id}>
              <h2 className='aisle-name'>{localize(aisle.name)}</h2>
              <ul className='items'>
                {aisle.items.map((item) => {
                  const isBought = ticked.includes(item.id)

                  return (
                    <li
                      data-state={isBought ? 'done' : undefined}
                      key={item.id}
                    >
                      <ToggleButton
                        className='item'
                        isSelected={isBought}
                        onChange={() => onTick(item.id)}
                      >
                        <span aria-hidden='true' className='tick' />
                        <span className='item-label'>
                          {localize(item.label)}
                        </span>
                      </ToggleButton>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
