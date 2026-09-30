import type React from 'react'

import { isAppleMobile } from '@/infrastructure/browser'
import { useAppUpdate } from '@/infrastructure/pwa/app-update'
import {
  promptInstall,
  useInstallState
} from '@/infrastructure/pwa/install-prompt'
import { ActionButton } from '@/presentation/components/action'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

/** Installed or not, and whether the whole manual is already on the device. */
export const InstallSection: React.FC = () => {
  const translate = useTranslate()
  const install = useInstallState()
  const { isOfflineReady } = useAppUpdate()

  const installKey =
    install === 'installed'
      ? 'settings.install.installed'
      : install === 'offered'
        ? 'settings.install.offered'
        : isAppleMobile()
          ? 'settings.install.apple'
          : 'settings.install.menu'

  return (
    <section className='setting'>
      <h3 className='heading'>{translate('settings.install.title')}</h3>
      <p className='prose'>{translate(installKey)}</p>
      <dl className='facts'>
        <dt>{translate('settings.install.offlineTerm')}</dt>
        <dd>
          {translate(
            isOfflineReady
              ? 'settings.install.offlineReady'
              : 'settings.install.offlinePending'
          )}
        </dd>
      </dl>
      {install === 'offered' && (
        <ActionButton
          label={translate('settings.install.action')}
          onPress={() => {
            void promptInstall()
          }}
          tone='ghost'
        />
      )}
    </section>
  )
}
