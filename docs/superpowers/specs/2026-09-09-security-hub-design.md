# Security Hub Restructure — Design

**Date:** 2026-09-09
**Status:** Approved for implementation
**Branch:** `refactor/security-hub`

## Problem

The portfolio tells its CTF / security story in six places, with real
duplication:

| Location | Content |
| --- | --- |
| Hero tagline | "...CTF competitions" |
| About paragraph 2 | "participating in CTFs including wargames.my, UMCS CTF 2025" |
| `#achievements` section + `/achievements/` page | 11 items, incl. 2 "CTF Workshop Speaker" |
| `#ctf-writeups` section | 3 live feed posts |
| `#community` section (added in PR #33) | "Talks" + "Workshops" — duplicates the 2 speaker entries |
| `#experience` → Cybersecurity → "CTF Competitions" | bullets that repeat competitions from Achievements |

Nine homepage sections, three of them CTF-related and overlapping.

## Goal

Collapse the three CTF-related sections into **one `#security` hub** with
stacked sub-rows. Reduce homepage from 9 sections to 6. Keep
`/achievements/` as the full archive. No new client JS.

## Homepage sections

Before: Hero · About · Achievements · CTF Writeups · Skills · Experience · Community · Projects · Contact
After: **Hero · About · CTF & Security · Skills · Experience · Projects · Contact**

## The `#security` section

Reuses the existing category-row pattern from `#experience` (a labelled
row heading + an `infoCard` grid) and the `heading` / `infoCard` macros
in `src/_includes/macros/ui.njk`. Four rows, in order:

1. **Competitions** — 6 most recent items of `kind: "competition"`,
   followed by a "View full record →" link to `/achievements/`.
2. **Writeups** — `ctfPosts` (build-time feed) with `ctf.items`
   fallback. Unchanged behaviour from PR #33.
3. **Talks & Workshops** — items of `kind: "talk"`.
4. **Challenges Authored** — items of `kind: "challenge"`. The row is
   omitted entirely while the list is empty (seeded empty; Danish adds
   his authored HACKNYX challenges here later).

Row headings are literal text in the template. One intro line comes from
`security.intro`.

## Data model

`src/_data/achievements.json` remains the single source of truth for the
competition/talk archive. Each item in `sections[].items` gains a
`kind` field: `"competition"` (default when absent), `"talk"`, or
`"challenge"`.

- The two "CTF Workshop Speaker" items become `kind: "talk"` and are
  retitled to the specific event ("Introduction to PWN — IIUM (ICE × SIG)",
  "Introduction to CTF — UPM GDoC"). The December talk gains a second
  link to the HTB Meetup writeup (`https://ctf.danplace.tech/posts/htb-meetup-iium/`).
- All other CTF-section items get `kind: "competition"`.
- The "Academic & Professional Recognition" and "Technical Projects &
  Innovation" sections are left untouched (archive-page only, not part
  of this pass — see Out of scope).

New computed data file **`src/_data/security.js`** (Eleventy JS data,
mirrors the existing `ctfPosts.js` pattern):

```js
const achievements = require("./achievements.json");
const flat = achievements.sections.flatMap((s) => s.items);
const byKind = (k) => flat.filter((i) => (i.kind || "competition") === k);

module.exports = {
  intro: "Competitions, writeups, talks, and challenges from my CTF journey",
  archiveUrl: "/achievements/",
  competitions: byKind("competition").slice(0, 6),
  talks: byKind("talk"),
  challenges: byKind("challenge"),
};
```

Items keep reverse-chronological order as authored in the JSON, so
`.slice(0, 6)` yields the six most recent competitions.

Pure helper `flattenByKind(sections)` is extracted to
`lib/security-data.js` and unit-tested (`test/security-data.test.js`).

### Files

| File | Change |
| --- | --- |
| `src/_data/security.js` | **New.** Computed rows for the hub. |
| `lib/security-data.js` | **New.** Pure `flattenByKind` helper. |
| `test/security-data.test.js` | **New.** Unit tests for the helper. |
| `src/_data/achievements.json` | Add `kind` to every `sections[0].items` entry; retitle + relink the two talk entries. |
| `src/_data/community.json` | **Deleted.** Content folded into the two talk entries. |
| `src/_data/experience.json` | Remove the "Cybersecurity" category (its only remaining item duplicates the hub). |
| `src/_data/profile.json` | About paragraph 2: drop the "participating in CTFs including..." clause. |
| `src/_data/site.json` | Nav: remove `#achievements`, `#ctf-writeups`, `#community`; add one **Security** entry (`#security`, icon `security`) between About and Skills. |
| `src/_data/ctf.json` | Reword `intro` (now a row label context, not a section intro). No structural change. |
| `src/index.njk` | Delete `#achievements`, `#ctf-writeups`, `#community` sections; add `#security`; re-band alternating section backgrounds (see below). |
| `src/achievements.njk` | Unchanged. |
| `lib/ctf-feed.js`, `src/_data/ctfPosts.js`, `test/ctf-feed.test.js` | Unchanged. |

### Section banding

`about` (plain) → `security` (`bg-card/40`) → `skills` (plain, flipped
from `bg-card/40`) → `experience` (`bg-card/40`, flipped from plain) →
`projects` (plain) → `contact` (plain).

## Error handling

No new failure modes. `security.js` reads a local JSON file
synchronously; a malformed `achievements.json` fails the build loudly,
which is correct. The Writeups row keeps PR #33's try/catch → fallback
behaviour via `ctfPosts.js`.

## Testing

- `npm test` — existing `ctf-feed` tests plus new `security-data` tests
  (flatten across sections, default kind, filter correctness, empty
  input).
- `npm run build` — confirm `_site/index.html` contains the four hub
  rows, the Challenges row is absent, `/achievements/` still renders the
  full list, and the deleted sections are gone.
- Local serve — visual check of the hub, nav (7 items, "Security"
  present, "Achievements"/"CTF Writeups"/"Community" gone), section
  banding, mobile drawer.
- Fallback — point `ctf.feedUrl` at a 404, rebuild, confirm the
  Writeups row falls back to `ctf.items`.

## Out of scope (flagged for a follow-up)

- `achievements.json` filler rows: "10+ Years Programming",
  "Multi-Disciplinary Skills", "Computer Science Student", and "Parcel
  Management System" (overlaps Projects' "BPN Project"). Content cleanup
  on the archive page, not section structure.
- Flattening `projects.json`'s three fuzzy categories.
- Renovate config (PR #37) and the Talks/Workshops split (PR #38) are
  handled separately; PR #38 is superseded by this work.
