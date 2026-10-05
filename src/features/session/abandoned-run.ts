import { weekOf } from '@/features/program/schedule'
import {
  readTrainingLogOrEmpty,
  saveTrainingLog
} from '@/features/program/use-training-log'
import { warnOnFailure } from '@/infrastructure/diagnostics'
import {
  clearRunSnapshot,
  readRunSnapshot
} from '@/infrastructure/storage/session-run-storage'

/**
 * A run left on another day will never resume, since only today's reopens:
 * the sets it holds were really done, so they go to the log as a stopped
 * session instead of vanishing with the snapshot. Called before the log is
 * read for the day; a second call finds nothing left to move.
 */
export const salvageAbandonedRun = (today: string): void => {
  const read = readRunSnapshot()
  if (read.status === 'failure' || read.data === null) return
  const snapshot = read.data
  if (snapshot.day === today) return

  warnOnFailure(
    clearRunSnapshot(),
    'The abandoned session could not be cleared'
  )
  if (snapshot.results.length === 0) return

  const log = readTrainingLogOrEmpty()
  saveTrainingLog({
    ...log,
    entries: [
      ...log.entries,
      {
        day: snapshot.day,
        results: snapshot.results,
        sessionId: snapshot.sessionId,
        stopped: true,
        week: snapshot.week ?? weekOf(log)
      }
    ]
  })
}
