import { describe, expect, it } from 'vitest'

import { createLatestOnly } from './latest-only'

const settleLater = <T>(): {
  promise: Promise<T>
  settle: (value: T) => void
} => {
  const { promise, resolve } = Promise.withResolvers<T>()
  return { promise, settle: resolve }
}

describe('latest only', () => {
  it('[latest-only] a newer run aborts the one in flight and drops its late answer', async () => {
    const latest = createLatestOnly()
    const first = settleLater<string>()
    const signals: AbortSignal[] = []

    const firstRun = latest.run((signal) => {
      signals.push(signal)
      return first.promise
    })
    const secondRun = latest.run((signal) => {
      signals.push(signal)
      return Promise.resolve('second')
    })

    first.settle('first')
    expect(await firstRun).toEqual({ error: 'aborted', status: 'failure' })
    expect(await secondRun).toEqual({ data: 'second', status: 'success' })
    expect(signals.map((signal) => signal.aborted)).toEqual([true, false])
  })

  it('[latest-only] abort cancels the run in flight, as on unmount', async () => {
    const latest = createLatestOnly()
    const pending = settleLater<string>()
    let seen: AbortSignal | null = null

    const run = latest.run((signal) => {
      seen = signal
      return pending.promise
    })
    latest.abort()
    pending.settle('late')

    expect(await run).toEqual({ error: 'aborted', status: 'failure' })
    expect(seen).toHaveProperty('aborted', true)
  })

  it('[latest-only] a newer run starts only once the aborted one has settled', async () => {
    const latest = createLatestOnly()
    const first = settleLater<string>()
    const order: string[] = []

    const firstRun = latest.run(async () => {
      order.push('first started')
      const answer = await first.promise
      order.push('first settled')
      return answer
    })
    const secondRun = latest.run(async () => {
      order.push('second started')
      return 'second'
    })
    await Promise.resolve()
    first.settle('first')

    expect(await secondRun).toEqual({ data: 'second', status: 'success' })
    expect(await firstRun).toEqual({ error: 'aborted', status: 'failure' })
    expect(order).toEqual(['first started', 'first settled', 'second started'])
  })

  it('[latest-only] a run replaced before it could start never starts', async () => {
    const latest = createLatestOnly()
    const first = settleLater<string>()
    const started: string[] = []

    void latest.run(() => {
      started.push('first')
      return first.promise
    })
    const skipped = latest.run(async () => {
      started.push('skipped')
      return 'skipped'
    })
    const last = latest.run(async () => {
      started.push('last')
      return 'last'
    })
    first.settle('first')

    expect(await skipped).toEqual({ error: 'aborted', status: 'failure' })
    expect(await last).toEqual({ data: 'last', status: 'success' })
    expect(started).toEqual(['first', 'last'])
  })
})
