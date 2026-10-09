// Builds with the private programme and deploys it to the owner's Netlify site:
//
//   pnpm deploy:personal
//
// Enabled only where a Netlify token is configured, by path, never by value:
// NETLIFY_TOKEN_FILE, or the first line of `netlify-token-path.local` at the
// repository root (git-ignored). Without one, this is a clone that does not
// deploy, and it exits quietly. Once enabled, every failure exits non-zero.
//
// Commands run through the platform shell so `pnpm` and `npx` resolve to their
// `.cmd` shims on Windows, from PowerShell, cmd and Git Bash alike.

import { spawn, spawnSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const NETLIFY_SITE = 'seance-adrien'
const TOKEN_PATH_FILE = 'netlify-token-path.local'
const PRIVATE_BUILD_MARKER = 'programme: private'

const root = fileURLToPath(new URL('../', import.meta.url))

const fail = (message) => {
  process.stderr.write(`deploy: ${message}\n`)
  process.exit(1)
}

const readTokenFile = () => {
  const fromEnv = process.env.NETLIFY_TOKEN_FILE
  if (fromEnv) return fromEnv
  const pathFile = join(root, TOKEN_PATH_FILE)
  if (!existsSync(pathFile)) return ''
  return readFileSync(pathFile, 'utf8').split('\n')[0].replaceAll('\r', '')
}

const isNonEmptyFile = (path) => {
  try {
    return statSync(path).size > 0
  } catch {
    return false
  }
}

/** Runs `command`, streaming its output to the console while keeping a copy. */
const runCaptured = (command) =>
  new Promise((resolve) => {
    const child = spawn(command, { cwd: root, shell: true })
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

const tokenFile = readTokenFile()
if (!tokenFile) {
  process.stdout.write(
    'deploy: no Netlify token configured, skipping the personal site\n'
  )
  process.exit(0)
}
if (!isNonEmptyFile(tokenFile)) {
  fail('the configured Netlify token file is missing or empty')
}

const validation = await runCaptured('pnpm validate')
if (validation.status !== 0) fail('pnpm validate failed, nothing deployed')
if (!validation.output.includes(PRIVATE_BUILD_MARKER)) {
  fail(
    `the build did not read the private programme, refusing to deploy it to ${NETLIFY_SITE}`
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

cpSync(join(root, 'dist'), join(staging, 'dist'), { recursive: true })
// Netlify answers a deep link it has no file for with a 404, where Cloudflare
// Pages falls back to the app by itself.
writeFileSync(join(staging, 'dist', '_redirects'), '/* /index.html 200\n')

const token = readFileSync(tokenFile, 'utf8').replaceAll(/[ \r\n"]/g, '')
const deploy = spawnSync(
  `npx --yes netlify-cli deploy --prod --dir=dist --site=${NETLIFY_SITE} --no-build`,
  {
    cwd: staging,
    env: { ...process.env, NETLIFY_AUTH_TOKEN: token },
    shell: true,
    stdio: 'inherit'
  }
)
process.exitCode = deploy.status ?? 1
