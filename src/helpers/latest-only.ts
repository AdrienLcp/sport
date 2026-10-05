import { Result } from '@adrienlcp/result'

/**
 * A request that a newer one replaces: each run gets its own signal, starting
 * a run aborts the one still in flight and waits for it to settle before
 * starting, so two runs never interleave, and an aborted run answers
 * `'aborted'` whatever its task resolved with, so a stale answer never lands.
 */
export type LatestOnly = {
  readonly abort: () => void
  readonly run: <T>(
    task: (signal: AbortSignal) => Promise<T>
  ) => Promise<Result<T, 'aborted'>>
}

export const createLatestOnly = (): LatestOnly => {
  let inFlight: AbortController | null = null
  let unsettled: Promise<unknown> | null = null

  const abort = () => {
    inFlight?.abort()
  }

  const answer = async <T>(
    task: (signal: AbortSignal) => Promise<T>,
    controller: AbortController,
    previous: Promise<unknown> | null
  ): Promise<Result<T, 'aborted'>> => {
    if (previous !== null) await previous
    if (controller.signal.aborted) return Result.failure('aborted')
    const answered = await task(controller.signal)
    if (controller.signal.aborted) return Result.failure('aborted')
    return Result.success(answered)
  }

  const run = <T>(
    task: (signal: AbortSignal) => Promise<T>
  ): Promise<Result<T, 'aborted'>> => {
    inFlight?.abort()
    const controller = new AbortController()
    inFlight = controller
    const answering = answer(task, controller, unsettled)
    const settling = answering.catch(() => undefined)
    unsettled = settling
    void settling.then(() => {
      if (unsettled === settling) unsettled = null
    })
    return answering
  }

  return { abort, run }
}
