import { readStoredText, writeStoredText } from '@adrienlcp/safe-storage'
import type React from 'react'
import { useState } from 'react'

import {
  isReadingSpecimen,
  switchProfile
} from '@/features/specimen/use-specimen'
import { applyUpdate, useAppUpdate } from '@/infrastructure/pwa/app-update'
import {
  promptInstall,
  useInstallState
} from '@/infrastructure/pwa/install-prompt'
import { homePathFor } from '@/infrastructure/router/navigation'
import { Button } from '@/presentation/components/button'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

import './shell-notices.sass'

/** A device choice: declining the install band once is declining it here. */
const INSTALL_DECLINED_KEY = 'seance.install-declined'

const wasInstallDeclined = (): boolean => {
  const read = readStoredText(INSTALL_DECLINED_KEY)
  return read.status === 'success' && read.data === 'yes'
}

type NoticeProps = {
  children: React.ReactNode
  /** The band's one or two actions, at its right end. */
  actions: React.ReactNode
  tone: 'plain' | 'specimen'
}

const Notice: React.FC<NoticeProps> = ({ actions, children, tone }) => (
  <div className='shell-notice' data-tone={tone} role='status'>
    <p className='notice-text'>{children}</p>
    <div className='notice-actions'>{actions}</div>
  </div>
)

/**
 * The slips tipped in above the plate: that the numbers on screen are the
 * specimen's, that a new printing is ready, that the manual can be installed.
 * Each holds until it is answered; none of them ever covers the plate.
 */
export const ShellNotices: React.FC = () => {
  const translate = useTranslate()
  const { isUpdateWaiting } = useAppUpdate()
  const install = useInstallState()
  const [isInstallDeclined, setIsInstallDeclined] = useState(wasInstallDeclined)
  const [isSpecimen] = useState(isReadingSpecimen)

  const declineInstall = () => {
    setIsInstallDeclined(true)
    const written = writeStoredText({ key: INSTALL_DECLINED_KEY, text: 'yes' })
    if (written.status === 'failure') {
      console.warn(`The install choice could not be saved (${written.error}).`)
    }
  }

  return (
    <>
      {isSpecimen && (
        <Notice
          actions={
            <Button
              className='notice-action'
              onPress={() =>
                switchProfile({ path: homePathFor(), profile: 'own' })
              }
            >
              {translate('specimen.leave')}
            </Button>
          }
          tone='specimen'
        >
          <b>{translate('specimen.stamp')}</b> {translate('specimen.band')}
        </Notice>
      )}

      {isUpdateWaiting && (
        <Notice
          actions={
            <Button className='notice-action' onPress={applyUpdate}>
              {translate('pwa.update.action')}
            </Button>
          }
          tone='plain'
        >
          {translate('pwa.update.text')}
        </Notice>
      )}

      {install === 'offered' && !isInstallDeclined && !isUpdateWaiting && (
        <Notice
          actions={
            <>
              <Button
                className='notice-action'
                onPress={() => {
                  void promptInstall()
                }}
              >
                {translate('pwa.install.action')}
              </Button>
              <Button className='notice-action quiet' onPress={declineInstall}>
                {translate('pwa.install.decline')}
              </Button>
            </>
          }
          tone='plain'
        >
          {translate('pwa.install.text')}
        </Notice>
      )}
    </>
  )
}
