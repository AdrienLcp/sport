import { useEffect, useEffectEvent } from 'react'

import { isoDay } from '@/helpers/days'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

import { reminderCopyOf } from './reminder-copy'
import {
  acknowledgeTodaysReminder,
  readReminderSchedule,
  remindIfOwed
} from './reminder-device'
import { nextReminder } from './reminder-schedule'

/** Past this, the clock looks again rather than trusting a long timer: a
    laptop asleep overnight wakes with a timer that no longer says anything
    true, and a schedule changed on the settings plate is picked up. */
const LONGEST_WAIT = 30 * 60 * 1000

/**
 * While the app is open — even in a background tab — the reminder arrives on
 * time from here. It is the one mechanism every browser honours; the worker
 * and the scheduled notifications only extend it to a closed app where the
 * browser allows it.
 */
export const useReminderClock = (): void => {
  const translate = useTranslate()

  const fire = useEffectEvent(async () => {
    const now = new Date()
    await remindIfOwed({
      copy: reminderCopyOf(translate),
      now,
      today: isoDay(now)
    })
  })

  useEffect(() => {
    let timer = 0
    let isStopped = false

    const arm = async () => {
      const schedule = await readReminderSchedule()
      if (isStopped) return
      const next = nextReminder(schedule, new Date())
      const wait = next === null ? Infinity : next.getTime() - Date.now()
      timer =
        wait > LONGEST_WAIT
          ? window.setTimeout(() => void arm(), LONGEST_WAIT)
          : window.setTimeout(() => {
              void fire().then(arm)
            }, wait)
    }

    const opened = new Date()
    void acknowledgeTodaysReminder({ now: opened, today: isoDay(opened) }).then(
      arm
    )
    return () => {
      isStopped = true
      window.clearTimeout(timer)
    }
  }, [])
}
