import type { Translate } from '@/presentation/i18n/translation'

import type { ReminderCopy } from './reminder-device'

export const reminderCopyOf = (translate: Translate): ReminderCopy => ({
  body: translate('reminders.notification.body'),
  title: translate('reminders.notification.title')
})
