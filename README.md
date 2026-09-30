# Séance

A bodyweight training programme drawn as a gymnastics manual: one plate per
movement, turned rather than scrolled. It guides a thirty-minute session on a
mat, keeps a journal and draws the curves — and it is a real Progressive Web
App: installable, fully offline, with reminders, and with every number kept on
the device.

Open `/specimen` to see every plate and curve full, with made-up numbers kept
apart from your own.

## What it does

- **The session.** Five sessions (lower body, push, easy cardio, pull, full
  body), each a warm-up, a circuit of four rounds and a cool-down. Every
  movement is a drawn, animated figure; the chrono is the rule under the head
  band; last week's number is always on the plate. An interrupted session
  resumes at its exact address, and the screen stays awake while it runs.
- **The journal.** Sessions and weekly readings (waist, weight), a report to
  paste into your own notes, and a JSON backup to move everything to another
  device.
- **The curves.** Regularity in weeks (a day grid, the current and longest
  run), sessions and repetitions per week, minutes held, and the body — one
  measure per chart, never two scales on one axis. Each chart can be walked
  with the keyboard or a finger and has its numbers in a table beneath.
- **The table.** A protein count toward the reader's own target, the plate
  drawn by hand portions, a batch-cooking pot, and a shopping list.
- **Settings.** English or French, light or dark printing, reminders, install,
  backup, and the specimen.

## The PWA

| Piece | Where |
| --- | --- |
| Web app manifest (icons, maskable, screenshots, shortcuts) | `src/infrastructure/pwa/web-app-manifest.ts` |
| Service worker: precached shell, offline navigation, reminders, notification clicks | `src/service-worker/` |
| Update-ready slip and install slip | `src/presentation/shell-notices.tsx`, `src/infrastructure/pwa/` |
| Reminders: schedule, in-app clock, device store the worker reads | `src/features/reminders/`, `src/infrastructure/notifications.ts`, `src/infrastructure/storage/device-store.ts` |

**Reminders, honestly.** Séance has no server, on purpose, so there is no Web
Push. A reminder arrives on time while the app is open, even in a background
tab. With the app closed it depends on the browser: where Notification
Triggers exist the reminders are handed over ahead of time; an installed app in
Chromium is woken a few times a day by Periodic Background Sync and shows the
reminder if it is due and no session ran yet; elsewhere — Safari, Firefox —
nothing can wake a closed web app, and the settings plate says so. A server
holding a push subscription and a schedule would be the one thing that knows
the reader exists; the trade was made for privacy.

## Your data

Everything lives in the browser (`localStorage`, plus a small IndexedDB shelf
the service worker reads for reminders). Nothing is sent anywhere; there is no
account. Export and import a JSON backup from Settings → Backup. The specimen
lives under its own keys and never reads or writes yours.

## Your own programme

The programme is plain data in `src/features/program/content/`, imported as
`@programme/<file>`. To train on a variant of it without committing it — your
own furniture, your own dumbbell, your own cautions — copy any of those files
into `private/programme/` (git-ignored) and edit the copy. Each import resolves
to `private/programme/<file>.ts` when it exists and to the public file
otherwise, for Vite, Vitest and `tsc` alike; the build prints which one it
read. A copy exports the same names as the file it replaces.

A push of `main` from a clone with a Netlify token configured —
`NETLIFY_TOKEN_FILE`, or its path on the first line of
`netlify-token-path.local` — first deploys the private build to a personal site
through `.githooks/pre-push`, and aborts the push if that fails.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:5186
pnpm validate     # typecheck + build + biome ci + tests
pnpm lint         # biome check --write
pnpm test         # vitest
pnpm preview      # the built app with its service worker, http://localhost:5187
```

Vite, React 19 with the React Compiler, react-router in data mode,
react-aria, indented Sass, strict TypeScript, Biome, Vitest,
`vite-plugin-pwa` with a hand-written Workbox service worker, and the
[`@adrienlcp/*`](https://github.com/AdrienLcp/packages) bricks: `i18n`,
`result`, `safe-storage`, `browser`, `react`, `theme-preference`.
The visual system is described in [`DESIGN.md`](DESIGN.md).

| Route | Plate |
| --- | --- |
| `/` | The session of the day; `/report` opens its report over it |
| `/journal` | The register; `/journal/measure`, `/journal/report`, `/journal/backup` |
| `/progress` | The curves |
| `/table` | The count; `/table/pot`, `/table/market` |
| `/settings` | Language, printing, reminders, install, data, specimen |
| `/specimen` | Opens the made-up profile and lands on the curves |
| `/dev/sheet`, `/dev/strip`, `/dev/figure/:id` | Drawing tools: contact sheet, decomposition, one figure |

## Licence

MIT. The Libre Franklin font is under the SIL Open Font License
(`src/presentation/styles/fonts/OFL.txt`).
