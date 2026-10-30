# Level redesign brief — Nonogram Atelier (shared by the level agents)

Workspace: /Users/jagjeetsingh/ai-game-factory/.workspaces/d7bebc6d-5835-4075-b86d-b7e325900918 (call it WS).
The game is a nonogram (picross) campaign: 120 handcrafted pictures in `src/game/islands/islNN.ts` (12 per island).
A lead level designer (an LLM reviewer) rated the set 6.5/10 (bar 8) and named levels to redesign. You redesign
YOUR levels only (listed in your task), by hand, the way a lead level designer at a top puzzle studio would.

## The spec format (src/game/types.ts, src/game/nonogram.ts)
```ts
{ id, title, palette: [hex,...], role: "teach"|"practise"|"twist"|"combine"|"boss"|"breather"|"finale",
  mechanics: [...], aha: "...", art: `rows`, smudge?: ["r4","c2"], crack?: ["r6.0"] }
```
- art: one text row per board row, all rows the same width. `.` paper, `#` ink (1-colour levels),
  `a`..`f` colour 1..6 (palette order), UPPERCASE `A`..`F` / `@` = stamped (given) colour cell, `,` = stamped paper,
  `~` = void (outside the shaped canvas, always paper).
- smudge: lines whose clue is unreadable ("r4" = row 5, "c2" = column 3; 0-based in the spec, 1-based in all text).
- crack: "r6.0" = row 7, clue number #1 shows "?" (colour kept, length hidden).
- Mechanics vocabulary: see MECHANICS in src/game/levels.ts (fill, x-marks, exact-fit, overlap, reach, color, void,
  stamp, color-cross, smudged, cracked, chain, combine).
- KEEP every level's `id` UNCHANGED (saves and pacing are keyed by it). Change title/art/aha/role/mechanics/smudge/crack freely.
- Keep the island's theme (island 1 seaside sketches, 2 woodland animals, 3 market food, 7 lantern festival night,
  8 kiln/ceramics, 9 observatory/space, 10 grand exhibit) and its mechanic.
- Board size: islands 1-2 roughly 5x5..12x12; island 3 7x7..12x12; late islands 9x9..15x15 (keep near the current size
  unless the reviewer asks otherwise). No empty rows/columns that do nothing.

## The checker (light — run it as often as you like)
Put candidate specs in a file under WS/.design/<your-agent-dir>/ exporting arrays, e.g.
```ts
import { INK } from "../../src/game/types";
export const A = [{ id: "jellyfish", title: "Jellyfish", palette: [INK], role: "teach", mechanics: ["overlap"], aha: "", art: `
.###.
#####` }];
```
and run from WS: `npx tsx .design/try.ts .design/<dir>/<file>.ts`
It prints for each spec: OK (unique by line logic) or BAD(n unknown cells + the stuck grid), solver looks / passes /
lines open at the start, the lines productive at the start (`first[...]`, 1-based: r3 = row 3, c4 = column 4), every
row and column clue, and `DUP <id>` if the clues equal another level's. Also "no-stamp: STILL UNIQUE" means a stamp is
decorative (bad — a stamp must matter) and "plain clues" shows what smudge/crack add.
Every level MUST be OK (unique, solvable by line logic alone, no guessing) and not DUP.

DO NOT run `npm run playtest`, `npm run levels`, scripts/tune-levels.ts, level-review.ts or validate — they are
CPU-heavy and the lead runs them once at the end (the machine is shared). Only use the checker above and `npx tsc --noEmit`.
Edit ONLY your own island files (src/game/islands/islNN.ts listed in your task). Do not touch docs/LEVELS.md (it is
regenerated from the specs), sim.ts, levels.ts, tune-levels.ts, pacing.json or any UI file.

## What the reviewer rewards / punishes (read carefully)
- The PICTURE must read at a glance as the named object: bold silhouette, distinct features (heads, eyes as a paper
  hole, arms/vanes that are clearly separate). Pictures that are "mostly a filled block", "noise", "abstract" or
  "unreadable" score 5/10. Prefer clean outlines + one or two interior details (a hollow, a pattern) over clutter.
- Every level has ONE clear insight ("aha") that differs from its neighbours; "row X fills, then column Y fills" chains
  of mechanical steps are weak. Not an earlier level in disguise. No busywork.
- The intent (aha text) must be TRUE of the board: every line it names must really be the first/forced step (check the
  checker's `first[...]` list and the clues it prints). Use 1-based row/column numbers. Name the role's purpose:
  teach = the mechanic alone on a small, friendly board with TWO OR MORE footholds (several lines open at the start,
  few passes, ≤ 5); practise = the mechanic again on a fuller picture with a new wrinkle; twist = the mechanic used in a
  genuinely surprising way (if it is not a real twist, relabel it practise); combine = with earlier mechanics;
  boss/finale = mastery. A teach level with 1 entry and 11 passes is "punishing" — keep teach levels shallow.
- Difficulty: solver passes and few open lines make a board deep; late practise boards were criticised as too hard,
  so practise/teach boards should have several open lines at the start (≥ 3 footholds) and ≤ 5 passes; bosses can be
  deeper. Don't make boards trivially easy either (a level solved in far fewer looks than its neighbours reads as filler).
- Mechanics must MATTER: a smudged line must really have to be read from its crossings; a cracked "?" must really be
  bounded by something specific; a stamp must be needed (no-stamp must NOT be still unique) — say what bounds/uses it.
- Write the aha in 1-3 sentences (≤ ~420 characters), concrete and specific, e.g.
  "Twist: the starfish's five arms leave no full line. Row 3's 2 2 2 in nine overlaps nothing, but column 5's 6 covers
  rows 2-7, so ..." — no marketing words.

## What to return (your final message)
For each level: number, id, new title, size, role, the clue fact that makes the aha true (from the checker), and the
checker's OK line (looks/passes/open). Mention anything you could not fix.
