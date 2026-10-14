import type React from 'react'
import { useId } from 'react'

import { homePathFor, useGoBack } from '@/infrastructure/router/navigation'
import {
  DEVICE_DATABASE,
  DEVICE_SHELF
} from '@/infrastructure/storage/device-store'
import { LOCALE_KEY } from '@/infrastructure/storage/locale-storage'
import {
  ACTIVE_PROFILE_KEY,
  type StoredShelf,
  storageKeyOf
} from '@/infrastructure/storage/storage-profile'
import { ActionButton } from '@/presentation/components/action'
import { Link } from '@/presentation/components/link'
import { Plate, PlateHead } from '@/presentation/components/plate'
import { VisuallyHidden } from '@/presentation/components/visually-hidden'
import { ScreenTitle } from '@/presentation/head/screen-title'
import { useI18n } from '@/presentation/i18n/i18n-provider'
import { RichText } from '@/presentation/i18n/rich-text'
import type { PlainTranslationKey } from '@/presentation/i18n/translation'
import { THEME_STORAGE_KEY } from '@/presentation/theme/theme-store'

import {
  CNIL_COMPLAINT_HREF,
  HOST,
  OFFLINE_CACHE_NAME,
  PUBLISHER
} from './legal-details'

import './legal-page.sass'

/** What each of a profile's shelves remembers, in the order the page lists them. */
const SHELF_PURPOSES = {
  log: 'legal.storage.log',
  run: 'legal.storage.run',
  settings: 'legal.storage.settings',
  table: 'legal.storage.table'
} as const satisfies Record<StoredShelf, PlainTranslationKey>

const SHELVES = Object.keys(SHELF_PURPOSES).filter(
  (shelf): shelf is StoredShelf => shelf in SHELF_PURPOSES
)

type StoredKeyProps = {
  children: React.ReactNode
  names: readonly string[]
}

const StoredKey: React.FC<StoredKeyProps> = ({ children, names }) => (
  <div className='stored-key'>
    <dt>
      {names.map((name) => (
        <code key={name}>{name}</code>
      ))}
    </dt>
    <dd>{children}</dd>
  </div>
)

type LegalSectionProps = {
  children: React.ReactNode
  heading: string
}

const LegalSection: React.FC<LegalSectionProps> = ({ children, heading }) => {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId} className='legal-section'>
      <h3 className='heading' id={headingId}>
        {heading}
      </h3>
      {children}
    </section>
  )
}

const linkTo =
  (href: string) =>
  (children: string): React.ReactNode => (
    <Link className='text-link' href={href}>
      {children}
    </Link>
  )

/**
 * The French LCEN's legal notice and the privacy policy, as one more plate of
 * the manual: who publishes it on the left page, what it keeps on the right.
 */
export const LegalPage: React.FC = () => {
  const { locale, translate } = useI18n()
  const goBack = useGoBack(homePathFor())
  const contactLink = linkTo(PUBLISHER.contactHref[locale])

  return (
    <Plate className='legal-page'>
      <ScreenTitle screen='legal' />
      <PlateHead title={translate('legal.head')} />

      <div className='body register'>
        <VisuallyHidden elementType='h1'>
          {translate('legal.title')}
        </VisuallyHidden>
        <div className='columns'>
          <div className='column'>
            <h2 className='page-heading'>{translate('legal.who')}</h2>

            <LegalSection heading={translate('legal.publisher.heading')}>
              <p className='prose'>
                <RichText
                  parts={translate.rich('legal.publisher.body', {
                    contact: contactLink,
                    name: PUBLISHER.name
                  })}
                />
              </p>
              <p className='prose'>{translate('legal.publisher.address')}</p>
            </LegalSection>

            <LegalSection heading={translate('legal.host.heading')}>
              <p className='prose'>{translate('legal.host.body')}</p>
              <address className='host-address'>
                {[HOST.name, ...HOST.addressLines].map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </LegalSection>

            <LegalSection heading={translate('legal.thirdParties.heading')}>
              <p className='prose'>
                {translate('legal.thirdParties.body', {
                  host: HOST.shortName
                })}
              </p>
            </LegalSection>

            <LegalSection heading={translate('legal.rights.heading')}>
              <p className='prose'>
                <RichText
                  parts={translate.rich('legal.rights.body', {
                    contact: contactLink
                  })}
                />
              </p>
              <p className='prose'>
                <RichText
                  parts={translate.rich('legal.rights.complaint', {
                    authority: linkTo(CNIL_COMPLAINT_HREF)
                  })}
                />
              </p>
            </LegalSection>
          </div>

          <div className='column'>
            <h2 className='page-heading'>{translate('legal.kept')}</h2>

            <LegalSection heading={translate('legal.readings.heading')}>
              <p className='prose'>{translate('legal.readings.body')}</p>
            </LegalSection>

            <LegalSection heading={translate('legal.storage.heading')}>
              <p className='prose'>{translate('legal.storage.device')}</p>
              <dl className='stored-keys'>
                {SHELVES.map((shelf) => (
                  <StoredKey key={shelf} names={[storageKeyOf(shelf, 'own')]}>
                    {translate(SHELF_PURPOSES[shelf])}
                  </StoredKey>
                ))}
                <StoredKey names={[LOCALE_KEY]}>
                  {translate('legal.storage.locale')}
                </StoredKey>
                <StoredKey names={[THEME_STORAGE_KEY]}>
                  {translate('legal.storage.theme')}
                </StoredKey>
                <StoredKey names={[ACTIVE_PROFILE_KEY]}>
                  {translate('legal.storage.profile')}
                </StoredKey>
                <StoredKey
                  names={SHELVES.map((shelf) =>
                    storageKeyOf(shelf, 'specimen')
                  )}
                >
                  {translate('legal.storage.specimen')}
                </StoredKey>
                <StoredKey names={[`${DEVICE_DATABASE} / ${DEVICE_SHELF}`]}>
                  {translate('legal.storage.reminders')}
                </StoredKey>
                <StoredKey names={[OFFLINE_CACHE_NAME]}>
                  {translate('legal.storage.offline')}
                </StoredKey>
              </dl>
              <p className='prose'>{translate('legal.storage.erase')}</p>
            </LegalSection>

            <LegalSection heading={translate('legal.measurement.heading')}>
              <p className='prose'>{translate('legal.measurement.body')}</p>
            </LegalSection>
          </div>
        </div>
      </div>

      <ActionButton
        label={translate('common.backToSession')}
        onPress={goBack}
        tone='ghost'
      />
    </Plate>
  )
}
