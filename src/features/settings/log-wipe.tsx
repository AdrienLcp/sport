import type React from 'react'
import { useState } from 'react'

import { withoutSessions } from '@/features/program/training-log'
import { useTrainingLog } from '@/features/program/use-training-log'
import { clearRunSnapshot } from '@/infrastructure/storage/session-run-storage'
import { ActionButton } from '@/presentation/components/action'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

type Step = 'armed' | 'cleared' | 'idle'

/**
 * Strikes out every session and the push-up test, so the next session is the
 * calibration evening again — for sessions run only to try the app. Two presses,
 * the second naming what goes: nothing here asks the browser for a dialog, and
 * the measures, the settings and the table are never touched.
 */
export const LogWipe: React.FC = () => {
  const translate = useTranslate()
  const [log, keepLog] = useTrainingLog()
  const [step, setStep] = useState<Step>('idle')
  const count = log.entries.length

  const wipe = () => {
    keepLog(withoutSessions(log))
    const cleared = clearRunSnapshot()
    if (cleared.status === 'failure') {
      console.warn(
        `The interrupted session could not be cleared (${cleared.error}).`
      )
    }
    setStep('cleared')
  }

  return (
    <section className='setting'>
      <h3 className='heading'>{translate('settings.wipe.title')}</h3>
      <p className='prose'>{translate('settings.wipe.prose')}</p>

      {step === 'cleared' && (
        <p className='prose' role='status'>
          {translate('settings.wipe.cleared')}
        </p>
      )}

      {step === 'armed' ? (
        <>
          <p className='prose' role='alert'>
            {translate('settings.wipe.confirmProse', { count: String(count) })}
          </p>
          <div className='exits'>
            <ActionButton
              label={translate('settings.wipe.confirm')}
              onPress={wipe}
            />
            <ActionButton
              label={translate('common.cancel')}
              onPress={() => setStep('idle')}
              tone='ghost'
            />
          </div>
        </>
      ) : (
        <ActionButton
          isDisabled={count === 0}
          label={translate(
            count === 0 ? 'settings.wipe.empty' : 'settings.wipe.arm'
          )}
          onPress={() => setStep('armed')}
          tone='ghost'
        />
      )}
    </section>
  )
}
