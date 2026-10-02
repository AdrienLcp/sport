import type React from 'react'
import { useState } from 'react'

import { proteinTargetOf } from '@/features/profile-settings/profile-settings'
import { readProfileSettingsOrEmpty } from '@/features/profile-settings/use-profile-settings'
import { dateOfDay } from '@/helpers/days'
import {
  homePathFor,
  tablePathFor,
  useGoBack,
  useTablePlateParam
} from '@/infrastructure/router/navigation'
import { useToday } from '@/presentation/clock/use-today'
import { ActionButton } from '@/presentation/components/action'
import { Link } from '@/presentation/components/link'
import { Plate } from '@/presentation/components/plate'
import { useTranslate } from '@/presentation/i18n/i18n-provider'
import type { PlainTranslationKey } from '@/presentation/i18n/translation'

import { CountPlate } from './count-plate'
import { MarketPlate } from './market-plate'
import { PotPlate } from './pot-plate'
import { MARKET_COUNT } from './table-catalogue'
import type { TablePlate } from './table-plates'
import {
  clearMarket,
  countSource,
  marketOf,
  proteinOf,
  type Table,
  tickItem,
  weekKeyOf
} from './table-tally'
import { readTableOrEmpty, saveTable } from './use-table'

import './table-page.sass'

const REGISTER: readonly {
  address: string
  label: PlainTranslationKey
  plate: TablePlate
}[] = [
  { address: 'T-01', label: 'table.register.count', plate: 'count' },
  { address: 'T-02', label: 'table.register.pot', plate: 'pot' },
  { address: 'T-03', label: 'table.register.market', plate: 'market' }
]

/**
 * The three table plates under one register. Each plate is its own address,
 * so a reload stays on it; switching plates replaces the entry rather than
 * stacking one, so Back leaves the table instead of paging through it.
 */
export const TablePage: React.FC = () => {
  const translate = useTranslate()
  const goBack = useGoBack(homePathFor())
  const plate = useTablePlateParam() ?? 'count'
  const day = useToday()
  const today = dateOfDay(day)
  const [table, setTable] = useState(readTableOrEmpty)
  const [settings] = useState(readProfileSettingsOrEmpty)
  const target = proteinTargetOf(settings)

  const week = weekKeyOf(today)
  const ticked = marketOf(table, week)

  const total = proteinOf(table.days[day])
  const bought = ticked.length

  const keep = (next: Table) => {
    saveTable(next)
    setTable(next)
  }

  const noteOf: Record<TablePlate, { isDone: boolean; note: string }> = {
    count: {
      isDone: total >= target,
      note: translate('table.register.countNote', {
        target: String(target),
        total: translate('table.grams', { value: total })
      })
    },
    market: {
      isDone: bought === MARKET_COUNT,
      note: translate('common.rank', {
        position: String(bought),
        total: String(MARKET_COUNT)
      })
    },
    pot: {
      isDone: false,
      note: translate('table.register.potBases')
    }
  }

  return (
    <Plate className='table-page'>
      {plate === 'count' ? (
        <CountPlate
          day={day}
          onCount={(id, delta) => keep(countSource({ day, delta, id, table }))}
          table={table}
          target={target}
          today={today}
        />
      ) : plate === 'pot' ? (
        <PotPlate today={today} />
      ) : (
        <MarketPlate
          onClear={() => keep(clearMarket(table, week))}
          onTick={(id) => keep(tickItem({ id, table, week }))}
          ticked={ticked}
          today={today}
        />
      )}

      <nav>
        <ul className='ledger tabs'>
          {REGISTER.map((entry) => (
            <li
              data-state={
                entry.plate === plate
                  ? 'live'
                  : noteOf[entry.plate].isDone
                    ? 'done'
                    : undefined
              }
              key={entry.plate}
            >
              <Link
                aria-current={entry.plate === plate ? 'page' : undefined}
                className='tab'
                href={tablePathFor(entry.plate)}
                routerOptions={{ replace: true }}
              >
                <span className='address'>{entry.address}</span>
                <span className='label'>{translate(entry.label)}</span>
                <span className='state'>{noteOf[entry.plate].note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <ActionButton
        label={translate('common.backToSession')}
        onPress={goBack}
        tone='ghost'
      />
    </Plate>
  )
}
