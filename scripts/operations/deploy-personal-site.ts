import { spawn } from 'node:child_process'
import {
  cpSync,
  mkdtempSync,
  readdirSync,
  rmdirSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { readSecret } from './bitwarden.ts'
import { HOSTING } from './hosting.ts'
import { SECRET_ENTRIES } from './secret-entries.ts'
import { exitWithError, REPOSITORY_ROOT, runCommand } from './shell.ts'

/**
 * `pnpm deploy:personal` — validates a build of the private programme and
 * deploys it to the owner's Netlify site. The token is read from Bitwarden
 * first, so a locked vault fails before the long validation.
 */

const SCOPE = 'deploy:personal'
const PRIVATE_BUILD_MARKER = 'programme: private'

type CapturedRun = {
  output: string
  status: number | null
}

/** Runs `command`, streaming its output to the console while keeping a copy. */
const runCaptured = (command: string) =>
  new Promise<CapturedRun>((resolve) => {
    const child = spawn(command, { cwd: REPOSITORY_ROOT, shell: true })
    let output = ''
    child.stdout.on('data', (chunk) => {
      output += chunk
      process.stdout.write(chunk)
    })
    child.stderr.on('data', (chunk) => {
      output += chunk
      process.stderr.write(chunk)
    })
    child.on('close', (status) => resolve({ output, status }))
  })

const secret = readSecret(SECRET_ENTRIES.netlifyToken)
const netlifyToken =
  secret.status === 'success' ? secret.data : exitWithError(SCOPE, secret.error)

const validation = await runCaptured('pnpm validate')
if (validation.status !== 0) {
  exitWithError(SCOPE, 'pnpm validate failed, nothing deployed')
}
if (!validation.output.includes(PRIVATE_BUILD_MARKER)) {
  exitWithError(
    SCOPE,
    `the build did not read the private programme, refusing to deploy it to ${HOSTING.netlifySite}`
  )
}

// Outside any pnpm workspace: under one, netlify-cli asks which project to deploy
// and dies without a TTY to answer it.
const staging = mkdtempSync(join(tmpdir(), 'seance-deploy-'))
process.on('exit', () => {
  for (const entry of readdirSync(staging)) {
    rmSync(join(staging, entry), { force: true, recursive: true })
  }
  try {
    rmdirSync(staging)
  } catch {
    // netlify-cli's detached telemetry process keeps the staging directory as its
    // working directory for a while after the deploy: only an empty folder stays.
  }
})

cpSync(join(REPOSITORY_ROOT, 'dist'), join(staging, 'dist'), {
  recursive: true
})
// Netlify answers a deep link it has no file for with a 404, where Cloudflare
// Pages falls back to the app by itself.
writeFileSync(join(staging, 'dist', '_redirects'), '/* /index.html 200\n')

const deployed = runCommand(
  `npx --yes netlify-cli deploy --prod --dir=dist --site=${HOSTING.netlifySite} --no-build`,
  { cwd: staging, env: { ...process.env, NETLIFY_AUTH_TOKEN: netlifyToken } }
)
process.exitCode = deployed ? 0 : 1
