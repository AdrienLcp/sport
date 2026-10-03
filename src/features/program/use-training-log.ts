import { useState } from 'react'

import { warnOnFailure } from '@/infrastructure/diagnostics'
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
  warnOnFailure(read, 'The training log could not be read')
  return read.status === 'success' ? read.data : EMPTY_LOG
}

/** A refused write loses the log, never the session on screen. */
export const saveTrainingLog = (log: Log): void => {
  const written = writeTrainingLog(log)
  warnOnFailure(written, 'The training log could not be saved')
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
