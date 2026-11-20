# When a step breaks

Find the step, read its log, apply the fix. The pages of each action carry
their own table of errors; this one covers what lies between them.

## Read the failure

A failed CI run:

```powershell
gh run list --limit 5
```

```powershell
gh run view <id> --log-failed
```

Expected: the log of the failing step only. Re-run it once the cause is fixed
— or straight away for a network hiccup:

```powershell
gh run rerun <id> --failed
```

## By step

| Step              | Symptom                                                          | Fix                                                                                                                                                                                                                         |
| ----------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CI `pnpm install` | `ERR_PNPM_OUTDATED_LOCKFILE`                                     | `pnpm install` here, commit `pnpm-lock.yaml`, ship.                                                                                                                                                                         |
| CI lint           | `biome ci` errors                                                | `pnpm lint` here, commit, ship.                                                                                                                                                                                             |
| CI spelling       | `Unknown word`                                                   | Fix the typo, or add a real word to `cspell.json` → `words`.                                                                                                                                                                |
| CI build or tests | A failing test or type error                                     | Reproduce with `pnpm validate` here; fix; ship.                                                                                                                                                                             |
| CI deploy         | Step _skipped_                                                   | The repository lacks `CLOUDFLARE_API_TOKEN`: `pnpm secrets:sync` ([secrets.md](secrets.md)), then `gh run rerun <id>`. A run whose commit is no longer the head of `main` also skips it, on purpose: the newer run deploys. |
| CI deploy         | `Authentication error [code: 10000]`                             | The Cloudflare token expired or lost a permission: renew it ([secrets.md](secrets.md)).                                                                                                                                     |
| CI deploy         | `Refusing to deploy: the build did not use the public programme` | A private file reached the repository: remove it from git (`git rm --cached`), check `.gitignore`, ship.                                                                                                                    |
| CI deploy         | `Project not found`                                              | The Pages project is gone: `pnpm hosting:create` ([hosting.md](hosting.md)).                                                                                                                                                |
| Site              | Old version still showing                                        | Hard-reload; the service worker serves the previous build until the new one installs. Check the CI run deployed the commit you expect.                                                                                      |
| Site              | Blank page, console errors                                       | Undo the deploy ([deploying.md](deploying.md)), then reproduce with `pnpm build` and `pnpm preview`.                                                                                                                        |
| Any script        | A `Bitwarden …` message                                          | [secrets.md](secrets.md), _Common errors_.                                                                                                                                                                                  |
| Any script        | `pnpm: command not found` or a wrong pnpm version                | `corepack enable`, open a new terminal.                                                                                                                                                                                     |

## Still stuck

- Cloudflare status: https://www.cloudflarestatus.com — GitHub:
  https://www.githubstatus.com — Netlify: https://www.netlifystatus.com
- Deploy by hand, from a clean clone of `main` only (it ships whatever the
  folder holds), with the token read from Bitwarden:

  ```powershell
  pnpm install --frozen-lockfile; pnpm build
  ```

  ```powershell
  $env:BITWARDENCLI_APPDATA_DIR = "$HOME\bitwarden-personal"; $env:CLOUDFLARE_ACCOUNT_ID = "431a529079f2d76802b95056e39950f0"; $env:CLOUDFLARE_API_TOKEN = bw get password "Cloudflare Pages token"; pnpm dlx wrangler@4 pages deploy dist --project-name sport --branch main
  ```

  Close the terminal afterwards: it holds the token.
