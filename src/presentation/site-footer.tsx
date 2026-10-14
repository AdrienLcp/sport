import type React from 'react'

import { legalPathFor } from '@/infrastructure/router/navigation'
import { Link } from '@/presentation/components/link'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

import './site-footer.sass'

/** The printer's line under every plate, holding the link to the legal page the law requires. */
export const SiteFooter: React.FC = () => {
  const translate = useTranslate()

  return (
    <footer className='site-footer'>
      <Link className='legal-link' href={legalPathFor()}>
        {translate('shell.footer.legal')}
      </Link>
    </footer>
  )
}
