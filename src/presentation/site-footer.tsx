import type React from 'react'

import { legalPathFor } from '@/infrastructure/router/navigation'
import { Link } from '@/presentation/components/link'
import { useI18n } from '@/presentation/i18n/i18n-provider'
import { RichText } from '@/presentation/i18n/rich-text'
import { AUTHOR, SOURCE_REPOSITORY_HREF } from '@/presentation/site-credits'

import './site-footer.sass'

/**
 * The printer's line under every plate: who made the manual, linked to his
 * site, its source when public, and the legal page the law requires.
 */
export const SiteFooter: React.FC = () => {
  const { locale, translate } = useI18n()

  const authorLink = (children: string): React.ReactNode => (
    <Link className='author-link' href={AUTHOR.siteHref[locale]}>
      {children}
    </Link>
  )

  return (
    <footer className='site-footer'>
      <p className='credit'>
        <RichText
          parts={translate.rich('shell.footer.credit', {
            author: authorLink,
            name: AUTHOR.name
          })}
        />
      </p>
      {SOURCE_REPOSITORY_HREF !== null && (
        <Link className='footer-link' href={SOURCE_REPOSITORY_HREF}>
          {translate('shell.footer.source')}
        </Link>
      )}
      <Link className='footer-link' href={legalPathFor()}>
        {translate('shell.footer.legal')}
      </Link>
    </footer>
  )
}
