import type React from 'react'
import { useState } from 'react'

import { sendTestNotification } from '@/features/reminders/reminder-device'
import {
  isReminderTime,
  type ReminderSchedule,
  toggleDay,
  WEEKDAYS_FROM_MONDAY,
  type Weekday
} from '@/features/reminders/reminder-schedule'
import { useReminderSchedule } from '@/features/reminders/use-reminder-schedule'
import { isStandaloneDisplay } from '@/infrastructure/browser'
import {
  notificationPermission,
  requestNotificationPermission,
  wakeCapabilities
} from '@/infrastructure/notifications'
import { ActionButton } from '@/presentation/components/action'
import { Switch } from '@/presentation/components/switch'
import { ToggleButton } from '@/presentation/components/toggle-button'
import { useTranslate } from '@/presentation/i18n/i18n-provider'
import type { Translate } from '@/presentation/i18n/translation'

/** 2024 opened on a Monday, so its first week spells the days out in ISO order. */
const weekdayName = (translate: Translate, day: Weekday): string =>
  translate('settings.reminders.weekday', {
    day: Temporal.PlainDate.from({ day, month: 1, year: 2024 })
  })

type TestOutcome = 'denied' | 'failed' | 'sent' | 'unsupported' | null

type ReminderControlsProps = {
  keep: (next: ReminderSchedule) => void
  schedule: ReminderSchedule
}

const ReminderControls: React.FC<ReminderControlsProps> = ({
  keep,
  schedule
}) => {
  const translate = useTranslate()
  const [permission, setPermission] = useState(notificationPermission)
  const [test, setTest] = useState<TestOutcome>(null)
  const [time, setTime] = useState(schedule.time)
  const isUnsupported = permission === 'unsupported'

  const enable = async (isEnabled: boolean) => {
    if (!isEnabled) {
      keep({ ...schedule, isEnabled })
      return
    }
    const asked = await requestNotificationPermission()
    setPermission(notificationPermission())
    if (asked.status === 'success') keep({ ...schedule, isEnabled })
  }

  const sendTest = async () => {
    if (notificationPermission() === 'default') {
      await requestNotificationPermission()
      setPermission(notificationPermission())
    }
    const sent = await sendTestNotification({
      body: translate('settings.reminders.testBody'),
      isSilent: !schedule.withSound,
      title: translate('reminders.notification.title')
    })
    setTest(sent.status === 'success' ? 'sent' : sent.error)
  }

  return (
    <>
      <Switch
        className='switch'
        isDisabled={isUnsupported || permission === 'denied'}
        isSelected={schedule.isEnabled}
        onChange={(isEnabled) => {
          void enable(isEnabled)
        }}
      >
        <span aria-hidden='true' className='tick' />
        <span className='switch-label'>
          {translate('settings.reminders.enable')}
        </span>
      </Switch>

      <fieldset className='days' disabled={!schedule.isEnabled}>
        <legend>{translate('settings.reminders.days')}</legend>
        <div className='day-row'>
          {WEEKDAYS_FROM_MONDAY.map((day) => (
            <ToggleButton
              className='day'
              isDisabled={!schedule.isEnabled}
              isSelected={schedule.days.includes(day)}
              key={day}
              onChange={() => keep(toggleDay(schedule, day))}
            >
              {weekdayName(translate, day)}
            </ToggleButton>
          ))}
        </div>
      </fieldset>

      <label className='time-field'>
        <span className='time-label'>
          {translate('settings.reminders.time')}
        </span>
        <input
          disabled={!schedule.isEnabled}
          onBlur={() => {
            if (isReminderTime(time)) keep({ ...schedule, time })
            else setTime(schedule.time)
          }}
          onChange={(event) => {
            setTime(event.target.value)
            if (isReminderTime(event.target.value)) {
              keep({ ...schedule, time: event.target.value })
            }
          }}
          type='time'
          value={time}
        />
      </label>

      <Switch
        className='switch'
        isDisabled={!schedule.isEnabled}
        isSelected={schedule.withSound}
        onChange={(withSound) => keep({ ...schedule, withSound })}
      >
        <span aria-hidden='true' className='tick' />
        <span className='switch-label'>
          {translate('settings.reminders.sound')}
        </span>
      </Switch>

      <p className='status' role='status'>
        {translate(`settings.reminders.permission.${permission}`)}
        {test !== null && ` ${translate(`settings.reminders.test.${test}`)}`}
      </p>

      <ActionButton
        isDisabled={isUnsupported || permission === 'denied'}
        label={translate('settings.reminders.sendTest')}
        onPress={() => {
          void sendTest()
        }}
        tone='ghost'
      />
    </>
  )
}

/**
 * Honest about what a web app can do: on time while it is open, and beyond
 * that only what this browser grants. There is no push server behind Séance,
 * on purpose — it would be the one thing that knows the reader exists.
 */
const HowItReaches: React.FC = () => {
  const translate = useTranslate()
  const capabilities = wakeCapabilities()
  const isInstalled = isStandaloneDisplay()

  const closedKey = capabilities.canScheduleAhead
    ? 'settings.reminders.reach.scheduled'
    : capabilities.canWakePeriodically
      ? isInstalled
        ? 'settings.reminders.reach.periodic'
        : 'settings.reminders.reach.periodicOnceInstalled'
      : 'settings.reminders.reach.none'

  return (
    <dl className='facts reach'>
      <dt>{translate('settings.reminders.reach.openTerm')}</dt>
      <dd>{translate('settings.reminders.reach.open')}</dd>
      <dt>{translate('settings.reminders.reach.closedTerm')}</dt>
      <dd>{translate(closedKey)}</dd>
    </dl>
  )
}

export const ReminderSection: React.FC = () => {
  const translate = useTranslate()
  const [schedule, keep] = useReminderSchedule()

  return (
    <section className='setting reminders'>
      <h3 className='heading'>{translate('settings.reminders.title')}</h3>
      {schedule !== null && (
        <ReminderControls keep={keep} schedule={schedule} />
      )}
      <HowItReaches />
    </section>
  )
}
