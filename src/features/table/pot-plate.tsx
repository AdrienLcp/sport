import type React from 'react'

import { PlateHead } from '@/presentation/components/plate'
import { useLocalize, useTranslate } from '@/presentation/i18n/i18n-provider'
import { bold, RichText } from '@/presentation/i18n/rich-text'

import { PlateFigure, Swatch } from './plate-figure'
import { BASES, PLATE_SHARES, POT, POT_TARGET } from './table-catalogue'

import './pot-plate.sass'

type PotPlateProps = {
  today: Date
}

/** T-02: the plate drawn, what goes in the pot, and the five bases. */
export const PotPlate: React.FC<PotPlateProps> = ({ today }) => {
  const translate = useTranslate()
  const localize = useLocalize()

  return (
    <>
      <PlateHead
        rank={translate('table.date', { day: today })}
        title={translate('table.pot.head')}
      />

      <div className='body register turning pot-plate'>
        <h1 className='headline'>{translate('table.pot.title')}</h1>
        <p className='prose'>{translate('table.pot.prose')}</p>

        <div className='divider' />

        <div className='columns'>
          <section className='column'>
            <h2 className='heading'>{translate('table.pot.plateTitle')}</h2>
            <p className='hint'>{translate('table.pot.plateHint')}</p>

            <figure className='dish'>
              <PlateFigure />
              <figcaption>
                <dl className='shares'>
                  {PLATE_SHARES.map((share) => (
                    <div className='share' key={share.id}>
                      <dt>
                        <Swatch share={share.id} />
                        {localize(share.hand)}
                      </dt>
                      <dd>
                        <b>{localize(share.what)}</b>
                        {translate('table.pot.shareDetail', {
                          detail: localize(share.detail)
                        })}
                      </dd>
                    </div>
                  ))}
                </dl>
              </figcaption>
            </figure>
          </section>

          <section className='column'>
            <h2 className='heading'>{translate('table.pot.insideTitle')}</h2>
            <p className='hint'>
              <RichText
                parts={translate.rich('table.pot.insideHint', {
                  b: bold,
                  target: String(POT_TARGET)
                })}
              />
            </p>

            <ul className='parts'>
              {POT.map((part) => (
                <li key={part.id}>
                  <span className='part-name'>{localize(part.what)}</span>
                  <span className='part-detail'>{localize(part.detail)}</span>
                </li>
              ))}
            </ul>

            <h2 className='heading bases-heading'>
              {translate('table.pot.basesTitle')}
            </h2>
            <p className='hint'>{translate('table.pot.basesHint')}</p>

            <ul className='bases'>
              {BASES.map((base) => (
                <li key={base.address}>
                  <span className='address'>{base.address}</span>
                  <span className='base-body'>
                    <span className='base-name'>{localize(base.name)}</span>
                    <span className='base-detail'>{localize(base.detail)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
