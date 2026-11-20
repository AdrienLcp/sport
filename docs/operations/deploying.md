# Deploying

Two sites are built from this repository:

| Site                                          | Programme                      | Deployed by                               |
| --------------------------------------------- | ------------------------------ | ----------------------------------------- |
| https://sport.adrienlcp.com, Cloudflare Pages | public                         | CI, on every push to `main`               |
| Netlify `seance-adrien`                       | private (`private/programme/`) | `pnpm deploy:personal`, from this machine |

## The public demo — `pnpm ship`

The CI workflow validates every push to `main` and deploys it when it is still
the head of `main`. Shipping is pushing; nothing is built here.

Prerequisites: on `main`, everything committed, `origin/main` pulled.

```powershell
pnpm ship
```

Expected: `git push` output, then `ship: pushed; watching CI run <id>`, the
run's jobs ticking green, and `ship: deployed to https://sport.adrienlcp.com`.
About three minutes. Open the site and check the change.

| Error                                         | Fix                                                                                                      |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `only main deploys`                           | `git switch main`, merge or cherry-pick the work there.                                                  |
| `the working tree has uncommitted changes`    | Commit (or `git stash`) first.                                                                           |
| `origin/main has commits this checkout lacks` | `git pull --rebase`, then `pnpm validate`, then `pnpm ship`.                                             |
| `nothing to ship`                             | Every commit is already pushed. To re-deploy the same commit, re-run its CI run: `gh run rerun <id>`.    |
| `the CI run failed`                           | Open the run link it prints; see [troubleshooting.md](troubleshooting.md).                               |
| `pushed; follow the deploy on …/actions`      | `gh` is missing or logged out; the push is done, watch the page. `gh auth login` fixes it for next time. |

## The private build — `pnpm deploy:personal`

Builds with the private programme, runs the whole validation, and deploys the
result to Netlify.

Prerequisites: the private programme in `private/programme/` (this machine
only); the Bitwarden entry `Netlify token` ([secrets.md](secrets.md)).

```powershell
pnpm deploy:personal
```

Expected: `Bitwarden: reading "Netlify token" …`, the master password prompt
if the vault is locked, the `pnpm validate` output (its build line says
`programme: private`), then netlify-cli's `Deploy is live!` with the site URL.

| Error                                          | Fix                                                                                                                                             |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| A `Bitwarden …` message                        | See the table in [secrets.md](secrets.md).                                                                                                      |
| `pnpm validate failed, nothing deployed`       | Fix what the validation reports; nothing reached Netlify.                                                                                       |
| `the build did not read the private programme` | `private/programme/` is missing or empty on this machine: restore it from your backup. The public programme is never sent to the personal site. |
| netlify-cli `Unauthorized` / `401`             | The `Netlify token` is revoked or expired: renew it ([secrets.md](secrets.md)).                                                                 |
| netlify-cli `Not Found` on the site            | The site was deleted: `pnpm hosting:create` ([hosting.md](hosting.md)).                                                                         |

## Undo a deploy

The way that leaves the history right: revert the commit and ship.

```powershell
git revert <commit>
```

```powershell
pnpm ship
```

Faster, while the fix is prepared: Cloudflare dashboard → _Workers & Pages →
sport → Deployments_, a previous deployment → _Rollback to this deployment_;
Netlify → _seance-adrien → Deploys_, a previous deploy → _Publish deploy_. The
next deploy replaces either rollback.
