import { useState } from 'react'

import {
  readTrainingLog,
  writeTrainingLog
} from '@/infrastructure/storage/training-log-storage'

import { EMPTY_LOG, type Log } from './training-log'

/**
 * A log that cannot be read — a private window, a hand-edited value — opens as
 * the empty one, which is what the app has always done: the plates still run.
 */
export const readTrainingLogOrEmpty = (): Log => {
  const read = readTrainingLog()
  if (read.status === 'success') return read.data
  console.warn(`The training log could not be read (${read.error}).`)
  return EMPTY_LOG
}

/** A refused write loses the log, never the session on screen. */
export const saveTrainingLog = (log: Log): void => {
  const written = writeTrainingLog(log)
  if (written.status === 'failure') {
    console.warn(`The training log could not be saved (${written.error}).`)
  }
}

/** The log as the page opened it, and the way to change it on screen and on disk. */
export const useTrainingLog = (): readonly [Log, (next: Log) => void] => {
  const [log, setLog] = useState(readTrainingLogOrEmpty)

  const keep = (next: Log) => {
    saveTrainingLog(next)
    setLog(next)
  }

  return [log, keep] as const
}
