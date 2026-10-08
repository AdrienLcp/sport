import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import type { Plugin } from 'vite'

const PROGRAMME_IMPORT = /^@programme\/(.+)$/

/**
 * Where `@programme/*` is looked up, first match wins: the owner's own copy,
 * kept out of git, then the public programme every clone builds with. `tsconfig.json`
 * lists the same two folders in the same order under `paths`, so the type
 * checker and the bundler always read the same file.
 */
export const PROGRAMME_FOLDERS = [
  'private/programme',
  'src/features/program/content'
] as const

const programmeFile = (root: string, name: string): string | undefined =>
  PROGRAMME_FOLDERS.map((folder) => resolve(root, folder, `${name}.ts`)).find(
    (path) => existsSync(path)
  )

/** True where the owner's own programme is present: the build is the private one, for the owner's site alone. */
export const readsPrivateProgramme = (root: string): boolean =>
  existsSync(resolve(root, PROGRAMME_FOLDERS[0]))

const programmeLabel = (root: string): string =>
  readsPrivateProgramme(root) ? 'private' : 'public'

/** Resolves `@programme/<file>` to the private copy when present, the public programme otherwise. */
export const programmeSource = (): Plugin => {
  let root = process.cwd()
  return {
    configResolved(config) {
      root = config.root
      config.logger.info(`programme: ${programmeLabel(root)}`)
    },
    enforce: 'pre',
    name: 'programme-source',
    resolveId(source) {
      const name = PROGRAMME_IMPORT.exec(source)?.[1]
      return name === undefined ? null : (programmeFile(root, name) ?? null)
    }
  }
}
