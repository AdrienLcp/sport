---
name: Séance
description: A gymnastics manual plate, one movement per page, turned rather than scrolled.
colors:
  ground: "#14120f"
  ink: "#e8e2d4"
  ink-soft: "#b5ac9a"
  ink-dim: "#9c9080"
  ink-spent: "#8a8071"
  signal: "#e2411e"
  signal-ink: "#f05a31"
  fig-far: "#938877"
  fig-prop: "#6a6154"
  fig-ghost: "#7b7263"
  rule: "#4a4236"
  rule-mid: "#3a342b"
  rule-soft: "#2e2a22"
  rule-faint: "#201d18"
  day-ground: "#f3eee2"
  day-ink: "#1a1712"
  day-ink-soft: "#453e33"
  day-ink-dim: "#655c4f"
  day-ink-spent: "#746a5c"
  day-signal: "#c7361a"
  day-signal-ink: "#ad2f10"
  day-rule: "#b3a896"
typography:
  display:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "clamp(4.5rem, 23vw, 7.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontFeature: "tabular-nums"
  headline:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 8vw, 2.9rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 7.2vw, 2.6rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.19em"
  action:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 800
    lineHeight: 1.5
    letterSpacing: "0.14em"
  ledger:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  none: "0"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "22px"
  s6: "30px"
  s7: "42px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.action}"
    rounded: "{rounded.none}"
    padding: "22px 12px"
    width: "100%"
    height: "69px"
  button-primary-hover:
    backgroundColor: "#ffffff"
    textColor: "{colors.ground}"
  button-primary-active:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.ground}"
  button-primary-disabled:
    backgroundColor: "{colors.rule-soft}"
    textColor: "{colors.ink-dim}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-dim}"
    typography: "{typography.action}"
    rounded: "{rounded.none}"
    padding: "17px 12px"
    height: "54px"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
  plate:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "22px 22px 16px"
  ledger-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink-dim}"
    typography: "{typography.ledger}"
    padding: "5px 0"
  ledger-row-live:
    textColor: "{colors.ink}"
  ledger-row-done:
    textColor: "{colors.ink-spent}"
  field-number:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0"
    height: "56px"
  tick:
    backgroundColor: "transparent"
    rounded: "{rounded.none}"
    size: "14px"
  tick-done:
    backgroundColor: "{colors.ink}"
---

# Design System: Séance

## Overview

**Creative North Star: "La planche de manuel de gymnastique"**

Not a fitness dashboard. A printed plate from a gymnastics manual — one movement per page, framed by an engraved hairline, turned rather than scrolled. The metaphor is not decoration: it decides what may exist. A printed plate has no catalogue, no progress ring, no badge, no flame, and no clock. When this system needed a chronometer, it did not add one; it took the rule that was already ruled under the title and let it withdraw. That substitution is the whole method in one gesture.

The world is read in a dark living room at the end of the day by someone tired, at one metre, with one sweaty hand. The **night printing** — cream ink on printer's black — is therefore the case every decision is weighed in, and ink is warm cream rather than white. The same manual also exists as a **day printing**, black ink on cream paper, which is simply what the plate looks like on paper: it follows the device's theme unless the reader chooses on the settings plate. Nothing is designed for one printing alone; every value exists in both, measured in both. Every decision is weighed against a single competitor: the sofa. Density loses to legibility every time. The reward vocabulary is deliberately impoverished — no congratulation, no celebration, no colour of victory — because the product's only permitted argument is last week's number, and an interface that cheers cannot be believed when it reports a regression.

The palette is two inks and one signal, and the discipline is that there is no third thing. A value that is neither ink nor signal does not exist here, which is why no arbitration gray was ever introduced to soften a decision. Contrast ratios are measured and written into the token file beside each value, not estimated.

**Key Characteristics:**
- One movement per plate; the plate is turned, never scrolled past
- Two inks, one signal, zero arbitration gray
- Depth by engraved inset hairline, never by shadow
- Square corners everywhere — a printed plate has no radius
- State carried by length, weight and strike-through, never by colour alone
- Drawn figures, not photographs: stroke weight is the depth system
- Tabular numerals globally; the number is the argument

## Colors

A warm two-ink palette on printing black, with a single cinnabar signal held in reserve for rules and points.

### Primary
- **Cinabre** (`#e2411e`): the only signal in the world, and it is spent sparingly — the rest-state chrono rule, the active marker, the focus ring, the caret. It carries no body text. Measured 4.5:1 on ground, which is the floor for a 2px rule and below what small text needs, which is why a second value exists for that case.
- **Cinabre de labeur** (`#f05a31`): the working variant, 5.7:1, used when the signal must carry small text — a ledger state, a count against target. It exists so the signal never has to be read at 4.5:1 in a dark room.

### Neutral
- **Noir d'imprimerie** (`#14120f`): the ground. Warm, never pure black; `color-scheme: dark` is declared so browser-drawn surfaces follow.
- **The day printing** swaps ground and ink — cream paper `#f3eee2`, printer's black `#1a1712` (15.4:1) — and re-steps every other value against the paper: prose `#453e33` (9.1:1), spent `#655c4f` (5.7:1), done `#746a5c` (4.6:1), and a deeper cinnabar, `#c7361a` for rules (4.6:1) and `#ad2f10` for small text (5.7:1). The rules darken instead of lightening. Both printings are written in `oklch()` in `_tokens.sass`, each value with its measured ratio.
- **Crème** (`#e8e2d4`): the ink, 14.5:1 (AAA). Headings, figures, numbers read in action, and the fill of the primary action.
- **Crème de prose** (`#b5ac9a`): 8.3:1 (AAA). Running prose and cues — long text that must stay comfortable, not loud.
- **Crème éteinte** (`#9c9080`): 6.0:1 (AA). Secondary labels, ledger rows at rest, ranks in the head band.
- **Crème dépensée** (`#8a8071`): 4.8:1 (AA). A movement already done. The strike-through carries the state; this value only stops it from competing.

### Tertiary — the figure's own inks
The figures are drawn in their own values, and they live in the token file rather than on the plate, because the contact sheet and the decomposition strip draw the same figures outside it.
- **`#938877` (fig-far)**: the far side of the body.
- **`#7b7263` (fig-ghost)**: the other end of a gesture, shown in reduced-motion.
- **`#6a6154` (fig-prop)**: floor, chair, step, table. The floor must be visible to say that the movement happens on the ground — an earlier value at `#4a4236` measured 1.9:1 against the plate and vanished.

### The rules
- **`#4a4236` (rule)**: the frame hairline. **`#3a342b` (rule-mid)**: under the head band. **`#2e2a22` (rule-soft)**: block separators. **`#201d18` (rule-faint)**: ledger lines.

### Named Rules

**The Two Inks Rule.** Two inks and one signal. A value that is neither ink nor signal does not exist in this world. When a new element seems to need a fourth value, it needs a different weight, a different size, or a rule — not a new colour. No arbitration gray has ever been added, and adding one is a redesign, not a tweak.

**The Signal Carries No Prose Rule.** Cinnabar marks rules, points and focus. It never sets a paragraph. When the signal must be read as text it switches to `signal-ink` (5.7:1); at any smaller size or lower weight, use ink instead.

**The Measured Comment Rule.** Every colour in `src/presentation/styles/_tokens.sass` carries its measured contrast ratio against ground in a comment above it. A value added without its measured ratio is not finished.

## Typography

**Display / Body / Label Font:** Libre Franklin variable (100–900), self-hosted, OFL 1.1, with `system-ui, sans-serif` as fallback. One family carries the entire system.

**Character:** A grotesque with enough width to stay legible at a metre and enough weight range to build the whole hierarchy without a second face. Self-hosting is not a preference but a requirement: the app runs with no network during a set, and `font-display: block` is set so a movement name never flashes in a fallback face mid-gesture. `font-synthesis: none` — a weight that does not exist is never faked. `font-variant-numeric: tabular-nums` is set on `body`, so every number in the product sits in its own column and a count changing from 9 to 10 does not shift the line.

### Hierarchy
- **Display** (800, `clamp(4.5rem, 23vw, 7.5rem)`, lh 1): the rest countdown, and only it. The one place where a number is allowed to be enormous.
- **Headline** (800, `clamp(1.9rem, 8vw, 2.9rem)`): plate titles — the session name on the title plate.
- **Title** (800, `clamp(1.75rem, 7.2vw, 2.6rem)`): the movement name on a working plate.
- **Body** (400, 1rem, lh 1.5, max measure 62ch): cues, guards, prose. Set in `ink-soft`.
- **Label** (700, 0.72rem, tracking 0.19em, uppercase): the head band, section markers, ranks.
- **Action** (800, 1.05rem, tracking 0.14em, uppercase): the primary and ghost buttons.
- **Ledger** (400, 0.85rem): the register of the five stations, with its address at 0.8em and its state at 0.78em.

### Named Rules

**The Tabular Rule.** Numerals are tabular everywhere, inherited from `body` and re-inherited explicitly by `button`. A number that shifts its neighbours when it changes is a bug, not a style.

**The One Family Rule.** Libre Franklin carries display, body and label. There is no second face and no monospace: measurement is already communicated by tabular numerals, so monospace would be a costume.

> **Grown, as the finish review asked.** The in-action count now scales from 24 to 32px and the number-to-beat renders at 19px in 800: a number read in action at one metre is display type, not a footnote.

## Layout

The plate is the layout. `.app-shell` is `100dvh` with safe-area padding; `.plate` is a flex column with `max-height: 100%` and `min-height: 0`, so the figure gives up space on a short screen instead of pushing the head band and the action off the bottom. The body scrolls **inside** the frame; the plate itself never grows past the screen.

Vertical rhythm comes from a single seven-step scale — 4, 8, 12, 16, 22, 30, 42 px — with 22px as the plate's own inset and 16px as the gap above the primary action. There is no grid and no container width: a plate is a single column, and the only horizontal division is the head band's `space-between` and the ledger row's baseline-aligned flex.

Responsive behaviour is a change of composition, not of scale alone. On a wide screen the plate splits into two columns via `display: contents` and explicit `order`, so the figure sits beside the text rather than above it. Type scales fluidly through `clamp()` keyed to viewport width, because the reading distance changes with the device: a phone on the floor at one metre and a desktop screen across a mat are both nominal.

### Named Rules

**The Turn, Don't Scroll Rule.** A plate fits the screen. If content does not fit, the body scrolls inside the frame — the frame, the head band and the action never leave. A screen where the engraved frame scrolls out of view has broken the world's central promise. (`min-height: 0` on every flex parent is what enforces this; a missing one is the known failure mode.)

**The One Action Rule.** A plate carries one primary action, full width, at the bottom, sized as the largest touch target on the screen (69px). Secondary destinations are ghost-toned and visibly smaller (54px), and they share a wrapping row rather than stacking into a menu.

## Elevation & Depth

**There are no shadows in this world.** Not one `box-shadow` carries an offset or a blur. Depth is engraved: the plate's frame is `inset 0 0 0 1px rule`, `inset 0 0 0 7px ground`, `inset 0 0 0 8px rule-soft` — a hairline, a gap, a hairline. It reads as a printed border, not as a card lifted off a surface.

Everything else that would conventionally be a shadow is a rule instead: a 1px border-bottom under the head band, a 1px inset ring around a ghost button, a 1px inset ring around a tick. Layering is expressed by ink value, never by elevation.

### Named Rules

**The Frame, Not Card Rule.** Containers are framed by inset hairlines, never floated by shadows. An offset or blurred `box-shadow` anywhere in this project is a foreign body.

**The Length Not Colour Rule.** State is carried by the length of a rule. The chrono is the hairline under the title, shrinking from full to nothing; the day gauge is the same rule laid down as the day fills, so "at target" simply looks like an untouched chrono. Where a variant must also be distinguishable, it changes **height** as well as hue — the rest chrono is 2px and cinnabar, so it survives colour-blindness and a dark room. Colour alone never says anything in this system.

## Shapes

**Zero radius, everywhere.** Buttons, plates, ticks, fields and frames are all square-cornered. A printed plate has no rounded corners, and softening one would put the whole metaphor in question.

The recurring silhouette is the framed rectangle: an outer hairline, a gap of ground, an inner hairline. It repeats at three scales — the plate, the ghost button, the 14px tick — which is what makes them read as one family rather than as three components.

Form language in the figures is separate and deliberate: bodies are drawn as rounded-cap strokes with a circular head, on a single ground line. The figure is the only organic geometry in the system, and it earns that by being the content.

### Named Rules

**The No Radius Rule.** `border-radius` is `0` throughout. There is no radius scale to pick from, and introducing one is a redesign.

## Components

### Buttons
- **Shape:** square (0 radius), full width, no border.
- **Primary:** cream fill on ground text (`ink` → `ground`), 22px vertical padding, 69px tall, uppercase 800 at 0.14em tracking. It is deliberately the largest touch target on any plate — one sweaty hand, at a metre, must not have to aim.
- **Hover / Active:** hover lifts the fill to white, active drops it to `ink-soft`. 180ms, `ease-out`.
- **Disabled:** `rule-soft` fill with `ink-dim` text (4.57:1, measured) and `cursor: default`. The button says there is nothing to note and stops taking taps, rather than looking live and doing nothing.
- **Ghost:** transparent with a 1px inset `rule` ring, `ink-dim` text, 17px padding, 54px tall, 0.85rem. Hover raises the text to `ink` and the ring to `ink-dim`. This is the tone for every secondary destination, including the exit from a running session.

### Cards / Containers
There are no cards. The plate is the only container: ground background, the engraved triple-hairline frame, 22px inset, no radius, no shadow. Nested containers do not exist in this world.

### Inputs / Fields
- **Style:** no box at all. A field is a baseline row with a 1px bottom rule; the input itself is transparent, borderless, 2.1rem / 800 in `ink` with tabular numerals — the value is typographically a display number, not form filler.
- **Focus:** the bottom rule turns cinnabar via `:focus-within`. Nothing glows, nothing grows.
- **Placeholder:** `ink-dim` at weight 400, so an empty field reads as empty rather than as a faint value.
- **Minimum height:** 56px.

### Ledger (signature component)
The register of the five stations, and the system's most reused idea. A borderless list; each row is a baseline flex of address (3.6em, 0.8em, tracked), label, and state, separated by `rule-faint` hairlines with no rule under the last row.
- **At rest:** `ink-dim`.
- **Live:** `ink`, with its state in `signal-ink`.
- **Done:** `ink-spent`, label struck through in `rule-mid` — the strike carries the state, the colour only steps back.

The same component carries the five movements of a session, the five drills of a warm-up, and the three plates of the nutrition screen. Reuse it before inventing a list.

### The chrono rule (signature component)
A 1px absolutely-positioned bar sitting exactly on the head band's bottom border, scaled from the left by `transform`. Running: `ink`, full → empty. Rest: 2px and cinnabar, sitting 2px lower. Read the other way as `.gauge`, it fills instead of empties and switches from `ink-dim` to `ink` at target, with a 320ms transition.

### The figure (signature component)
Drawn SVG, one movement per figure, looping without end — unless the movement does not move. A pure hold has no entry in `MOTIONS` and the plate stands still: the plank, the side plank, the hollow, and every one of the eleven stretches. A still figure here is the system working, not a figure that failed to start. Depth is carried by **stroke weight**: torso 8, thigh 5.5, shin 4.2, far side 4.2. Props and floor in `fig-prop`. Under `prefers-reduced-motion` the figure does not freeze — it prints the arrival pose behind the working pose as a broken construction line, which is what a real manual does.

### The cue block
Under the legend of a set or warm-up plate: a ruled toggle line (« Le geste en détail · 4 étapes »), then a two-column list — the term in head-band capitals (Bouge, Fixe, Serre, Rythme, Souffle, Appui, Arrêt), the answer in `ink-soft` prose. The toggle swaps the list for the numbered how-to **in the same place**, so the plate never grows. On a phone the block scrolls inside itself under a figure that keeps at least `clamp(120px, 21vh, 190px)`, and « Ensuite » steps aside: the register and the action never move. The « Rythme » line and the figure's cycle read the same `Tempo`.

### The erratum
What a printed manual tips in when a page came out wrong: a plate with no figure, the band reading « Erratum » with the failing address as its rank, a headline, one line of prose saying nothing noted is lost, the raw reason in a `facts` list, then the one full-width action back to the session and a ghost reload. It carries no cinnabar: an error is not a state to confirm. The same plate, without reason or reload, answers an unknown address.

### The charts (the curves plate)
The curves are the journal's register drawn: one form per question, no dashboard. A **day grid** (weeks as columns, weekdays as rows) is the register of trained evenings — a whole session inks the cell, a stopped one outlines it, a rest day is the faint cell it is. **Columns** count a week: sessions (whole inked, stopped as an outline stacked above), repetitions, minutes held; past weeks in spent ink, the current week — still being written — in full ink. **Lines** follow the body, one measure per chart and never two scales on one axis; the last reading is the cinnabar dot, as in the journal. Marks are square-ended like everything else, grids are hairlines, and no text is drawn inside an SVG. Every chart has its numbers in a table beneath, a slip framed by a hairline that repeats the value under the pointer, and an invisible native range input over the plot that the keyboard, a screen reader and a dragging finger all walk the marks with.

Regularity is counted in **weeks, never days**: a rest day is part of the programme, and a day streak would punish the one thing it asks for. It is printed as facts — current run, longest run, steady weeks — never as a flame or a badge.

### The slips above the plate
What the app needs to say about itself sits in a framed band above the plate, never over it: a new printing ready (reload), the manual installable (install, not now), and the **specimen stamp** — the one band framed in cinnabar, so a visitor reading made-up numbers never mistakes them for their own.

### Settings controls
The colophon's controls are the manual's own pieces: choices are ledger lines (the chosen one bold, its state in `signal-ink`), a switch is the shopping list's square tick, weekdays are framed cells that ink when a reminder falls on them, and the time is a ruled field like a reading.

### Browser surfaces
Selection is `ink` on `ground` inverted, the caret is cinnabar, the scrollbar is `rule` on `ground` and thin, the focus ring is a 2px cinnabar outline at 3px offset, and `-webkit-tap-highlight-color` is cleared. These ship with the design; they are not defaults left alone.

## Do's and Don'ts

### Do:
- **Do** reuse the ledger, the plate frame and the chrono rule before drawing a new component. Three scales of the same framed rectangle is what makes this read as a system.
- **Do** carry state with length, weight or a strike-through, and give any colour-coded state a second channel (height, weight, or a mark).
- **Do** write the measured contrast ratio above every new colour value in `_tokens.sass`.
- **Do** keep the primary action full width and the largest target on the plate, with secondary destinations ghost-toned and visibly smaller.
- **Do** show the movement. A name is a reminder; the figure is the instruction. A new movement without a drawn figure is unfinished work, not a shortcut.
- **Do** set every flex parent that must not grow with `min-height: 0`, or the plate will scroll out of its own frame.

### Don't:
- **Don't** add a third family of value — no arbitration gray, no second accent, no new hue. If an element needs separation, change weight, size or rule.
- **Don't** use `box-shadow` with an offset or a blur. Depth here is engraved, not lifted.
- **Don't** introduce `border-radius`. It is 0 throughout and there is no scale to draw from.
- **Don't** set prose or small text in `signal` (4.5:1). Use `signal-ink` for small text, or ink.
- **Don't** add a badge, a day streak, a ring, a trophy or an automatic congratulation. The only reward this product permits is last week's number; regularity is reported in weeks, as a fact.
- **Don't** let a plate scroll as a whole, and never allow the frame, the head band or the action to leave the screen.
- **Don't** use a raw hex outside `_tokens.sass`. The one that used to live in a component (`#fff` on the hovered primary action) is now the token `--ink-bright`, and it stays an anomaly, not a precedent.
- **Don't** ship a sound, a haptic or any output that starts at a non-zero volume. This app is used in a quiet home at the end of the day; anything audible begins muted and is opt-in — reminders included, which are silent unless the reader asks for the system sound.
