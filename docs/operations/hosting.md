# Hosting

| Piece         | Provider                              | Identifier (`scripts/operations/hosting.ts`)              |
| ------------- | ------------------------------------- | --------------------------------------------------------- |
| Public demo   | Cloudflare Pages, account `431a5290…` | project `sport`                                           |
| Its address   | Cloudflare DNS, zone `adrienlcp.com`  | proxied `CNAME sport.adrienlcp.com → <project>.pages.dev` |
| Private build | Netlify                               | site `seance-adrien`                                      |

The CI secrets that let GitHub deploy to Cloudflare are covered in
[secrets.md](secrets.md).

## Create or recreate it — `pnpm hosting:create`

Creates whichever piece is missing and leaves the others alone: run it on a
new account, after deleting a project by mistake, or just to check. It never
deletes or changes an existing piece.

Prerequisites: the Bitwarden entries `Cloudflare Pages token` and
`Netlify token` ([secrets.md](secrets.md)).

```powershell
pnpm hosting:create
```

Expected, when everything exists:

```text
hosting:create: Pages project sport exists
hosting:create: sport.adrienlcp.com is attached to the Pages project
hosting:create: DNS sport.adrienlcp.com → sport-buk.pages.dev exists
hosting:create: Netlify site seance-adrien exists
hosting:create: done: …
```

Each missing piece prints `created` or `attached` instead.

After recreating the Pages project:

1. Cloudflare may give it a new `pages.dev` host (`sport-<suffix>.pages.dev`);
   the script points the DNS at it. Put the new host in `public/_headers`, so
   the `pages.dev` copy stays out of search engines.
2. `pnpm secrets:sync` if the GitHub secrets were lost too.
3. Deploy: push a commit with `pnpm ship`, or re-run the last CI run
   (`gh run rerun <id>`). The custom domain answers once its certificate is
   issued, a few minutes after attaching.

After recreating the Netlify site: `pnpm deploy:personal`.

## Common errors

| Message                                                     | Fix                                                                                                                                                     |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A `Bitwarden …` message                                     | See [secrets.md](secrets.md).                                                                                                                           |
| `… answered 403` with `Authentication error` (code `10000`) | The Cloudflare token lacks a permission listed in [secrets.md](secrets.md), or expired: renew it.                                                       |
| `… answered 409` on the Pages project                       | The name `sport` is taken by a project of another kind (a Worker): rename it in `hosting.ts` and in `.github/workflows/ci.yml`.                         |
| `DNS sport.adrienlcp.com points to …, not …`                | A record exists with another target: in the dashboard, _adrienlcp.com → DNS → Records_, edit it to the `pages.dev` host printed.                        |
| Netlify `422` with `subdomain must be unique`               | Another Netlify account holds `seance-adrien`: pick a new name in `hosting.ts`.                                                                         |
| The site answers `522` or a certificate error               | The certificate is not issued yet: wait ten minutes. Still failing: dashboard → _Workers & Pages → sport → Custom domains_, and follow what it reports. |
