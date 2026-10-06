import { describe, expect, it } from 'vitest'

import { parseBackup } from './backup'

describe('backup', () => {
  it('[backup] restores a file written before settings existed, with none', () => {
    const parsed = parseBackup(
      JSON.stringify({
        app: 'seance',
        log: { entries: [], version: 1 },
        savedAt: '2026-09-22',
        table: { days: {}, version: 1 },
        version: 1
      })
    )
    expect(parsed.status).toBe('success')
    if (parsed.status === 'success') {
      expect(parsed.data.settings).toEqual({ version: 1 })
      expect(parsed.data.table.market).toEqual({ ticked: [], week: '' })
    }
  })

  it('[backup] keeps a valid protein target and drops an absurd one', () => {
    const withTarget = (proteinTarget: number) =>
      parseBackup(
        JSON.stringify({
          app: 'seance',
          log: { entries: [] },
          settings: { proteinTarget },
          version: 1
        })
      )
    const kept = withTarget(140)
    const dropped = withTarget(9000)
    expect(kept.status === 'success' && kept.data.settings).toEqual({
      proteinTarget: 140,
      version: 1
    })
    expect(dropped.status === 'success' && dropped.data.settings).toEqual({
      version: 1
    })
  })

  it('[backup] refuses a file from another app, and text that is not JSON', () => {
    expect(
      parseBackup('{"app":"other","version":1,"log":{"entries":[]}}')
    ).toEqual({
      error: 'not_a_backup',
      status: 'failure'
    })
    expect(parseBackup('not json').status).toBe('failure')
  })

  const backupWith = (fields: Record<string, unknown>) =>
    JSON.stringify({
      app: 'seance',
      log: { entries: [], version: 1 },
      savedAt: '2026-10-01',
      table: { days: {}, version: 1 },
      version: 1,
      ...fields
    })

  it('[backup] refuses as damaged a file of ours whose sessions cannot be read', () => {
    expect(
      parseBackup(
        backupWith({
          log: { entries: [{ day: 3, results: 'many', sessionId: 'Z' }] }
        })
      )
    ).toEqual({ error: 'damaged', status: 'failure' })
  })

  it('[backup] refuses as damaged a table whose counts are not numbers', () => {
    expect(
      parseBackup(
        backupWith({ table: { days: { '2026-10-01': { eggs: 'two' } } } })
      )
    ).toEqual({ error: 'damaged', status: 'failure' })
  })

  it('[backup] drops a field the app never wrote instead of storing it', () => {
    const parsed = parseBackup(
      backupWith({
        injected: true,
        log: {
          entries: [
            {
              day: '2026-10-01',
              extra: 'x',
              results: [{ address: '1.1', round: 1, value: 12 }],
              sessionId: 'A',
              week: 1
            }
          ],
          version: 1
        }
      })
    )
    expect(parsed.status === 'success' && parsed.data).toEqual({
      app: 'seance',
      log: {
        entries: [
          {
            day: '2026-10-01',
            results: [{ address: '1.1', round: 1, value: 12 }],
            sessionId: 'A',
            week: 1
          }
        ],
        version: 1
      },
      savedAt: '2026-10-01',
      settings: { version: 1 },
      table: { days: {}, market: { ticked: [], week: '' }, version: 1 },
      version: 1
    })
  })
})
