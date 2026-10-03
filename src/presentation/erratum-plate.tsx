import type React from 'react'

import { ScreenTitle } from '@/presentation/head/screen-title'

import { ActionButton, ActionLink } from './components/action'
import { Plate, PlateHead } from './components/plate'
import { useTranslate } from './i18n/i18n-provider'

import './erratum-plate.sass'

type ErratumPlateProps = {
  /** Where the reader goes back to: the session of the day. */
  homeHref: string
  /** The address that failed, printed in the head band. */
  path: string
  /**
   * What went wrong:
   * - `{ kind: 'missing' }` — no plate has this address
   * - `{ kind: 'crash', reason, onReload }` — the plate failed to draw
   */
  failure:
    | { kind: 'missing' }
    | { kind: 'crash'; onReload: () => void; reason: string }
}

/**
 * The slip a printed manual tips in when a page came out wrong. Same plate,
 * no figure: the reader learns what failed, that nothing noted is lost, and
 * is handed the way back.
 */
export const ErratumPlate: React.FC<ErratumPlateProps> = ({
  failure,
  homeHref,
  path
}) => {
  const translate = useTranslate()

  return (
    <Plate className='erratum-plate'>
      <ScreenTitle screen='erratum' />
      <PlateHead rank={path} title={translate('erratum.head')} />

      {failure.kind === 'crash' ? (
        <div className='body'>
          <h1 className='headline'>{translate('erratum.crash.headline')}</h1>
          <p className='prose'>{translate('erratum.crash.prose')}</p>
          <div className='divider' />
          <dl className='facts'>
            <dt>{translate('erratum.crash.reason')}</dt>
            <dd className='reason'>{failure.reason}</dd>
          </dl>
        </div>
      ) : (
        <div className='body'>
          <h1 className='headline'>{translate('erratum.missing.headline')}</h1>
          <p className='prose'>{translate('erratum.missing.prose')}</p>
        </div>
      )}

      <ActionLink href={homeHref} label={translate('common.backToSession')} />
      {failure.kind === 'crash' && (
        <ActionButton
          label={translate('erratum.crash.reload')}
          onPress={failure.onReload}
          tone='ghost'
        />
      )}
    </Plate>
  )
}
